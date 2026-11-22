require('module-alias/register');

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');
const Redis = require('ioredis');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');

const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;
const { REMAINING } = KEYS;
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

  require.cache[require.resolve('../dist/services/redis/redis')] = {
    exports: { redis },
  };
  const {
    getAnalyzerRemainingCounts,
    resetAnalyzerQuota,
    withAnalyzerQuota,
  } = require('../dist/services/redis/analyzerQuota');
  const { initRedisKeys } = require('../dist/services/redis/initRedisKeys');
  const exhausted = {
    status: 400,
    message: 'No remaining request count available.',
  };

  const seed = async (field, total, user) => {
    await clearKeys();
    await initRedisKeys(redis);
    await getAnalyzerRemainingCounts(firstIP);
    await getAnalyzerRemainingCounts(secondIP);
    await redis.hset(REMAINING.TOTAL, field, total);
    await redis.hset(REMAINING.USER(firstIP), field, user);
  };

  for (const [field, cost] of [
    [FIELDS.ANALYSIS, 2],
    [FIELDS.RANDOM_SENTENCE, 1],
  ]) {
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
    'a late refund leaves the reset shared balance unchanged',
    async () => {
      const field = FIELDS.ANALYSIS;
      const fireDate = new Date('2026-11-22T15:00:00Z');
      await seed(field, 2, 2);
      await assert.rejects(
        withAnalyzerQuota(firstIP, field, 2, async () => {
          await resetAnalyzerQuota(fireDate);
          await withAnalyzerQuota(secondIP, field, 2, async () => {});
          await initRedisKeys(redis);
          await resetAnalyzerQuota(fireDate);
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
          await getAnalyzerRemainingCounts(firstIP);
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
