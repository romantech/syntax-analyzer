require('module-alias/register');

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');
const Redis = require('ioredis');
const { createAnalyzerQuota } = require('../dist/services/redis/analyzerQuota');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');

const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;
const { REMAINING } = KEYS;
const periodField = '__quota_period';
const beforeMidnight = Date.parse('2026-11-22T14:59:59Z');
const midnight = Date.parse('2026-11-22T15:00:00Z');
const firstIP = '192.0.2.1';
const secondIP = '192.0.2.2';
const redisPort = process.env.REDIS_TEST_PORT;

test('analyzer quotas on Redis', { skip: !redisPort }, async (context) => {
  const prefix = `quota-test:${randomUUID()}:`;
  const redis = new Redis({
    host: '127.0.0.1',
    port: Number(redisPort),
    keyPrefix: prefix,
    maxRetriesPerRequest: 0,
    retryStrategy: () => null,
  });
  const clearKeys = async () => {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length)
      await redis.del(...keys.map((key) => key.slice(prefix.length)));
  };
  context.after(async () => {
    try {
      if (redis.status === 'ready') await clearKeys();
    } finally {
      redis.disconnect();
    }
  });
  await redis.ping();

  let now;
  const quotaRedis = {
    eval: (script, ...args) =>
      redis.eval(
        now === undefined
          ? script
          : script.replace("redis.call('TIME')[1]", String(now / 1000)),
        ...args,
      ),
  };
  const { getAnalyzerRemainingCounts, withAnalyzerQuota } =
    createAnalyzerQuota(quotaRedis);
  const exhausted = {
    status: 400,
    message: 'No remaining request count available.',
  };

  const seed = async (field, total, user) => {
    now = beforeMidnight;
    await clearKeys();
    await getAnalyzerRemainingCounts(firstIP);
    await getAnalyzerRemainingCounts(secondIP);
    await redis.hset(REMAINING.TOTAL, field, total);
    await redis.hset(REMAINING.USER(firstIP), field, user);
  };

  await context.test(
    'initializes a missing shared quota using Redis time',
    async () => {
      const [secondsBefore] = await redis.time();
      assert.deepEqual(await getAnalyzerRemainingCounts(firstIP), {
        analysis: 10,
        random_sentence: 20,
      });
      const [secondsAfter] = await redis.time();
      const period = Number(await redis.hget(REMAINING.TOTAL, periodField));
      assert.equal((period / 1000 + 9 * 3600) % 86400, 0);
      assert(period <= Number(secondsAfter) * 1000);
      assert(period + 86400000 > Number(secondsBefore) * 1000);
    },
  );

  await context.test(
    'the first read after midnight resets both shared balances',
    async () => {
      await seed(FIELDS.ANALYSIS, 0, 2);
      await redis.hset(REMAINING.TOTAL, FIELDS.RANDOM_SENTENCE, 0);
      assert.deepEqual(await getAnalyzerRemainingCounts(firstIP), {
        analysis: 0,
        random_sentence: 0,
      });

      now = midnight;
      assert.deepEqual(await getAnalyzerRemainingCounts(firstIP), {
        analysis: 2,
        random_sentence: 20,
      });
      assert.deepEqual(
        await redis.hmget(
          REMAINING.TOTAL,
          periodField,
          FIELDS.ANALYSIS,
          FIELDS.RANDOM_SENTENCE,
        ),
        [String(midnight), '50', '100'],
      );
    },
  );

  await context.test(
    'concurrent requests at midnight share one refill across both operations',
    async () => {
      await seed(FIELDS.ANALYSIS, 0, 2);
      await redis.hset(REMAINING.TOTAL, FIELDS.RANDOM_SENTENCE, 0);

      now = midnight;
      await Promise.all([
        withAnalyzerQuota(firstIP, FIELDS.ANALYSIS, 2, async () => {}),
        getAnalyzerRemainingCounts(firstIP),
        withAnalyzerQuota(secondIP, FIELDS.RANDOM_SENTENCE, 1, async () => {}),
      ]);
      assert.deepEqual(
        await redis.hmget(
          REMAINING.TOTAL,
          periodField,
          FIELDS.ANALYSIS,
          FIELDS.RANDOM_SENTENCE,
        ),
        [String(midnight), '48', '99'],
      );

      const restartedQuota = createAnalyzerQuota(quotaRedis);
      now += 3600000;
      await restartedQuota.getAnalyzerRemainingCounts(secondIP);
      await restartedQuota.withAnalyzerQuota(
        secondIP,
        FIELDS.ANALYSIS,
        2,
        async () => {},
      );
      assert.deepEqual(
        await redis.hmget(
          REMAINING.TOTAL,
          periodField,
          FIELDS.ANALYSIS,
          FIELDS.RANDOM_SENTENCE,
        ),
        [String(midnight), '46', '99'],
      );
    },
  );

  await context.test('initializes an old undated quota only once', async () => {
    await seed(FIELDS.ANALYSIS, 0, 2);
    await redis.hset(REMAINING.TOTAL, periodField, randomUUID());
    await withAnalyzerQuota(firstIP, FIELDS.ANALYSIS, 2, async () => {});
    await getAnalyzerRemainingCounts(firstIP);
    assert.equal(await redis.hget(REMAINING.TOTAL, FIELDS.ANALYSIS), '48');
  });

  await context.test(
    'preserves the balance and expiration of a legacy IP quota',
    async () => {
      const field = FIELDS.ANALYSIS;
      const userKey = REMAINING.USER(firstIP);
      await seed(field, 50, 4);
      await redis.hdel(userKey, periodField);
      const expiresAt = await redis.pexpiretime(userKey);

      await withAnalyzerQuota(firstIP, field, 2, async () => {});
      assert.equal(await redis.hget(userKey, field), '2');
      assert.equal(await redis.pexpiretime(userKey), expiresAt);
    },
  );

  for (const [field, cost, initialBalance] of [
    [FIELDS.ANALYSIS, 2, 10],
    [FIELDS.RANDOM_SENTENCE, 1, 20],
  ]) {
    await context.test(
      `${field} reserves credits for a new or expired IP without a balance lookup`,
      async () => {
        now = beforeMidnight;
        await clearKeys();
        const userKey = REMAINING.USER(firstIP);
        for (const stage of ['new', 'expired']) {
          if (stage === 'expired') await redis.pexpireat(userKey, 1);
          assert.equal(await redis.exists(userKey), 0);
          assert.equal(
            await withAnalyzerQuota(firstIP, field, cost, async () => 'done'),
            'done',
          );
          assert.equal(
            await redis.hget(userKey, field),
            String(initialBalance - cost),
          );
          const ttl = await redis.pttl(userKey);
          assert(ttl > 86390000 && ttl <= 86400000);
        }
      },
    );

    for (const sameUser of [true, false]) {
      await context.test(
        `${field} admits one concurrent request at the ${sameUser ? 'IP' : 'shared'} limit`,
        async () => {
          await seed(field, sameUser ? cost * 2 : cost, cost);
          let modelCalls = 0;
          const started = Promise.withResolvers();
          const finish = Promise.withResolvers();
          const firstRequest = withAnalyzerQuota(
            firstIP,
            field,
            cost,
            async () => {
              modelCalls += 1;
              started.resolve();
              return finish.promise;
            },
          );

          try {
            await Promise.race([started.promise, firstRequest]);
            await assert.rejects(
              withAnalyzerQuota(
                sameUser ? firstIP : secondIP,
                field,
                cost,
                async () => {
                  modelCalls += 1;
                },
              ),
              exhausted,
            );
            assert.equal((await getAnalyzerRemainingCounts(firstIP))[field], 0);
            assert.equal(
              await redis.hget(REMAINING.TOTAL, field),
              sameUser ? String(cost) : '0',
            );
            assert.equal(await redis.hget(REMAINING.USER(firstIP), field), '0');
            assert.equal(modelCalls, 1);
          } finally {
            finish.resolve();
            await firstRequest;
          }
        },
      );
    }

    await context.test(
      `${field} restores the IP and shared balances on failure`,
      async () => {
        await seed(field, cost, cost);
        const modelError = new Error('Model request failed');
        await assert.rejects(
          withAnalyzerQuota(firstIP, field, cost, async () => {
            assert.equal(await redis.hget(REMAINING.TOTAL, field), '0');
            assert.equal(await redis.hget(REMAINING.USER(firstIP), field), '0');
            assert.equal(
              (await getAnalyzerRemainingCounts('192.0.2.3'))[field],
              0,
            );
            throw modelError;
          }),
          (error) => error === modelError,
        );
        assert.equal(await redis.hget(REMAINING.TOTAL, field), String(cost));
        assert.equal(
          await redis.hget(REMAINING.USER(firstIP), field),
          String(cost),
        );
        assert.equal(
          (await getAnalyzerRemainingCounts('192.0.2.3'))[field],
          cost,
        );
        assert.equal(
          await withAnalyzerQuota(firstIP, field, cost, async () => 'retry'),
          'retry',
        );
      },
    );
  }

  await context.test(
    'concurrent first requests share one IP quota and expiration',
    async () => {
      now = beforeMidnight;
      await clearKeys();
      const field = FIELDS.ANALYSIS;
      const userKey = REMAINING.USER(firstIP);
      const responses = await Promise.allSettled(
        Array.from({ length: 6 }, () =>
          withAnalyzerQuota(firstIP, field, 2, async () =>
            redis.pexpiretime(userKey),
          ),
        ),
      );
      const expiresAt = await redis.pexpiretime(userKey);
      assert(expiresAt > 0);
      assert.deepEqual(
        responses.filter((response) => response.status === 'fulfilled'),
        Array.from({ length: 5 }, () => ({
          status: 'fulfilled',
          value: expiresAt,
        })),
      );
      const rejected = responses.filter(
        (response) => response.status === 'rejected',
      );
      assert.equal(rejected.length, 1);
      assert.equal(rejected[0].reason.status, exhausted.status);
      assert.equal(rejected[0].reason.message, exhausted.message);
      assert.equal(await redis.hget(REMAINING.TOTAL, field), '40');
      assert.deepEqual(await getAnalyzerRemainingCounts(firstIP), {
        analysis: 0,
        random_sentence: 20,
      });
      assert.equal(await redis.pexpiretime(userKey), expiresAt);
    },
  );

  await context.test(
    'refunding a first reservation restores the credits and keeps its expiration',
    async () => {
      now = beforeMidnight;
      await clearKeys();
      const field = FIELDS.ANALYSIS;
      const userKey = REMAINING.USER(firstIP);
      const modelError = new Error('Model request failed');
      let expiresAt;
      await assert.rejects(
        withAnalyzerQuota(firstIP, field, 2, async () => {
          expiresAt = await redis.pexpiretime(userKey);
          assert(expiresAt > 0);
          throw modelError;
        }),
        (error) => error === modelError,
      );
      assert.equal(await redis.hget(REMAINING.TOTAL, field), '50');
      assert.equal(await redis.hget(userKey, field), '10');
      assert.equal(await redis.pexpiretime(userKey), expiresAt);
    },
  );

  await context.test(
    'a late refund leaves the reset shared balance unchanged',
    async () => {
      const field = FIELDS.ANALYSIS;
      await seed(field, 2, 2);
      await assert.rejects(
        withAnalyzerQuota(firstIP, field, 2, async () => {
          now = midnight;
          await withAnalyzerQuota(secondIP, field, 2, async () => {});
          throw new Error('Model request failed');
        }),
        /Model request failed/,
      );
      assert.equal(await redis.hget(REMAINING.TOTAL, field), '48');
      assert.equal(await redis.hget(REMAINING.USER(firstIP), field), '2');
    },
  );

  await context.test(
    'a late refund leaves a recreated IP balance unchanged',
    async () => {
      const field = FIELDS.RANDOM_SENTENCE;
      const userKey = REMAINING.USER(firstIP);
      await seed(field, 2, 1);
      await assert.rejects(
        withAnalyzerQuota(firstIP, field, 1, async () => {
          await redis.pexpire(userKey, 0);
          await withAnalyzerQuota(firstIP, field, 1, async () => {});
          throw new Error('Model request failed');
        }),
        /Model request failed/,
      );
      assert.equal(await redis.hget(REMAINING.TOTAL, field), '1');
      assert.equal(await redis.hget(userKey, field), '19');
      assert((await redis.ttl(userKey)) > 0);
    },
  );

  await context.test(
    'replayed scripts debit and refund the reservation once',
    async (testContext) => {
      const field = FIELDS.ANALYSIS;
      await seed(field, 4, 4);
      const runScript = redis.eval.bind(redis);
      testContext.mock.method(redis, 'eval', async (...args) => {
        await runScript(...args);
        return runScript(...args);
      });
      await assert.rejects(
        withAnalyzerQuota(firstIP, field, 2, async () => {
          assert.equal(await redis.hget(REMAINING.TOTAL, field), '2');
          assert.equal(await redis.hget(REMAINING.USER(firstIP), field), '2');
          throw new Error('Model request failed');
        }),
        /Model request failed/,
      );
      assert.equal(await redis.hget(REMAINING.TOTAL, field), '4');
      assert.equal(await redis.hget(REMAINING.USER(firstIP), field), '4');
    },
  );

  await context.test(
    'refunds a reservation after Redis loses its reply',
    async (testContext) => {
      const field = FIELDS.ANALYSIS;
      await seed(field, 2, 2);
      const runScript = redis.eval.bind(redis);
      const redisError = new Error('Connection lost before reservation reply');
      testContext.mock.method(
        redis,
        'eval',
        async (...args) => {
          await runScript(...args);
          throw redisError;
        },
        { times: 1 },
      );
      let modelCalls = 0;
      await assert.rejects(
        withAnalyzerQuota(firstIP, field, 2, async () => {
          modelCalls += 1;
        }),
        (error) => error === redisError,
      );
      assert.equal(modelCalls, 0);
      assert.equal(await redis.hget(REMAINING.TOTAL, field), '2');
      assert.equal(await redis.hget(REMAINING.USER(firstIP), field), '2');
    },
  );
});
