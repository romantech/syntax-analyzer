require('module-alias/register');

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');
const Redis = require('ioredis');
const {
  startApp,
  modelAnalysis,
  analysisPromptValues,
} = require('../test-support/app');
const { createAnalyzerQuota } = require('../dist/services/redis/analyzerQuota');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');

const { KEYS, FIELDS, PROMPT_FIELDS } = ANALYZER_REDIS_SCHEMA;
const { REMAINING } = KEYS;
const periodField = '__quota_period';
const beforeMidnight = Date.parse('2026-11-22T14:59:59Z');
const midnight = Date.parse('2026-11-22T15:00:00Z');
const firstIP = '192.0.2.1';
const secondIP = '192.0.2.2';
const firstClient = { ip: firstIP };
const secondClient = { ip: secondIP };
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

  await context.test(
    'shares counters across analyzer routes using a signed cookie',
    async (testContext) => {
      await clearKeys();
      const origin = 'https://syntax-analyzer.example.com';
      let failModel = false;
      const baseURL = await startApp(testContext, {
        corsOrigins: [origin],
        isKoyeb: true,
        isProd: true,
        analyzerCookieSecret: 'integration-test-cookie-signing-secret',
        redis,
        createModel: () => ({
          invoke: async () => modelAnalysis(),
          withStructuredOutput: () => ({
            invoke: async () => ({ sentences: failModel ? [] : ['I walk.'] }),
          }),
        }),
      });
      await redis.hset(KEYS.PROMPT, {
        [FIELDS.RANDOM_SENTENCE]: 'Generate sentences.',
        [PROMPT_FIELDS.STRUCTURED_ANALYSIS]: analysisPromptValues[0],
        [PROMPT_FIELDS.STRUCTURED_ANALYSIS_RETRY]: analysisPromptValues[1],
      });

      const request = (
        path,
        { cookie, ip = firstIP, legacy = false, body } = {},
      ) =>
        fetch(`${baseURL}/analyzer${path}`, {
          method: body ? 'POST' : 'GET',
          headers: {
            Origin: origin,
            'X-Forwarded-For': ip,
            ...(legacy ? {} : { 'X-Analyzer-Browser': '1' }),
            ...(cookie ? { Cookie: cookie } : {}),
            ...(body ? { 'Content-Type': 'application/json' } : {}),
          },
          body: body && JSON.stringify(body),
        });
      const remaining = '/remaining-counts';
      const randomSentences = '/random-sentences?sent_count=1';
      const preflight = await fetch(`${baseURL}/analyzer`, {
        method: 'OPTIONS',
        headers: {
          Origin: origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,x-analyzer-browser',
        },
      });
      assert.equal(preflight.status, 200);
      assert.match(
        preflight.headers.get('access-control-allow-headers'),
        /x-analyzer-browser/i,
      );

      const first = await request(remaining);
      assert.equal(first.headers.get('access-control-allow-origin'), origin);
      assert.equal(
        first.headers.get('access-control-allow-credentials'),
        'true',
      );
      assert.equal(first.headers.get('cache-control'), 'private, no-store');
      const setCookie = first.headers.get('set-cookie');
      assert.match(setCookie, /^__Host-analyzer_browser=/);
      assert.match(setCookie, /; Path=\/;.*; HttpOnly; Secure; SameSite=Lax$/);
      const cookie = setCookie.split(';')[0];
      const initialCounts = { analysis: 10, random_sentence: 20 };
      assert.deepEqual(await first.json(), initialCounts);

      const analysis = await request('', {
        cookie,
        body: { model: 'primary', sentence: ['I', 'walk.'] },
      });
      assert.equal(analysis.status, 200);
      assert.equal(analysis.headers.has('set-cookie'), false);
      assert.deepEqual((await analysis.json()).sentence, ['I', 'walk.']);

      const sentences = await request(randomSentences, { cookie });
      assert.equal(sentences.status, 200);
      assert.deepEqual(await sentences.json(), ['I walk.']);
      failModel = true;
      const failure = await request(randomSentences, { cookie });
      assert.equal(failure.status, 502);
      await failure.json();
      assert.deepEqual(
        await redis.hmget(
          REMAINING.IP(firstIP),
          FIELDS.ANALYSIS,
          FIELDS.RANDOM_SENTENCE,
        ),
        ['9', '19'],
      );

      const moved = await request(remaining, { cookie, ip: secondIP });
      assert.deepEqual(await moved.json(), {
        analysis: 9,
        random_sentence: 19,
      });

      const tamperedCookie = `${cookie.slice(0, -1)}${cookie.endsWith('a') ? 'b' : 'a'}`;
      const second = await request(remaining, { cookie: tamperedCookie });
      const replacement = second.headers.get('set-cookie');
      assert.match(replacement, /^__Host-analyzer_browser=/);
      const secondCookie = replacement.split(';')[0];
      assert.notEqual(secondCookie, cookie);
      assert.deepEqual(await second.json(), {
        analysis: 9,
        random_sentence: 19,
      });

      const secondMoved = await request(remaining, {
        cookie: secondCookie,
        ip: secondIP,
      });
      assert.deepEqual(await secondMoved.json(), initialCounts);

      const legacy = await request(remaining, { cookie, legacy: true });
      assert.equal(legacy.headers.has('set-cookie'), false);
      assert.deepEqual(await legacy.json(), {
        analysis: 9,
        random_sentence: 19,
      });
      await clearKeys();
    },
  );

  const seed = async (field, total, user) => {
    now = beforeMidnight;
    await clearKeys();
    await getAnalyzerRemainingCounts(firstClient);
    await getAnalyzerRemainingCounts(secondClient);
    await redis.hset(REMAINING.TOTAL, field, total);
    await redis.hset(REMAINING.USER(firstIP), field, user);
  };

  await context.test(
    'initializes a missing shared quota using Redis time',
    async () => {
      const [secondsBefore] = await redis.time();
      assert.deepEqual(await getAnalyzerRemainingCounts(firstClient), {
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

  for (const [name, sameIP] of [
    ['IP', true],
    ['service', false],
  ]) {
    await context.test(
      `concurrent new browsers cannot exceed the ${name} cap`,
      async () => {
        now = beforeMidnight;
        await clearKeys();
        const field = FIELDS.ANALYSIS;
        const requests = Array.from({ length: 26 }, (_, index) => ({
          ip: sameIP ? firstIP : `192.0.2.${index + 1}`,
          browserId: randomUUID(),
        }));
        const results = await Promise.allSettled(
          requests.map((client) =>
            withAnalyzerQuota(client, field, 2, async () => {}),
          ),
        );
        assert.equal(
          results.filter(({ status }) => status === 'fulfilled').length,
          sameIP ? 5 : 25,
        );
        for (const result of results.filter(
          ({ status }) => status === 'rejected',
        )) {
          assert.equal(result.reason.message, exhausted.message);
        }
        const freshBrowser = { ip: firstIP, browserId: randomUUID() };
        assert.equal(
          (await getAnalyzerRemainingCounts(freshBrowser))[field],
          0,
        );
        assert.equal((await getAnalyzerRemainingCounts(firstClient))[field], 0);
        await assert.rejects(
          withAnalyzerQuota(freshBrowser, field, 2, async () => {}),
          exhausted,
        );
      },
    );
  }

  await context.test(
    'the first read after midnight resets both shared balances',
    async () => {
      await seed(FIELDS.ANALYSIS, 0, 2);
      await redis.hset(REMAINING.TOTAL, FIELDS.RANDOM_SENTENCE, 0);
      assert.deepEqual(await getAnalyzerRemainingCounts(firstClient), {
        analysis: 0,
        random_sentence: 0,
      });

      now = midnight;
      assert.deepEqual(await getAnalyzerRemainingCounts(firstClient), {
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
        withAnalyzerQuota(firstClient, FIELDS.ANALYSIS, 2, async () => {}),
        getAnalyzerRemainingCounts(firstClient),
        withAnalyzerQuota(
          secondClient,
          FIELDS.RANDOM_SENTENCE,
          1,
          async () => {},
        ),
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
      await restartedQuota.getAnalyzerRemainingCounts(secondClient);
      await restartedQuota.withAnalyzerQuota(
        secondClient,
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
    await withAnalyzerQuota(firstClient, FIELDS.ANALYSIS, 2, async () => {});
    await getAnalyzerRemainingCounts(firstClient);
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

      await withAnalyzerQuota(firstClient, field, 2, async () => {});
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
            await withAnalyzerQuota(
              firstClient,
              field,
              cost,
              async () => 'done',
            ),
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
            firstClient,
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
                sameUser ? firstClient : secondClient,
                field,
                cost,
                async () => {
                  modelCalls += 1;
                },
              ),
              exhausted,
            );
            assert.equal(
              (await getAnalyzerRemainingCounts(firstClient))[field],
              0,
            );
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
          withAnalyzerQuota(firstClient, field, cost, async () => {
            assert.equal(await redis.hget(REMAINING.TOTAL, field), '0');
            assert.equal(await redis.hget(REMAINING.USER(firstIP), field), '0');
            assert.equal(
              (await getAnalyzerRemainingCounts({ ip: '192.0.2.3' }))[field],
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
          (await getAnalyzerRemainingCounts({ ip: '192.0.2.3' }))[field],
          cost,
        );
        assert.equal(
          await withAnalyzerQuota(
            firstClient,
            field,
            cost,
            async () => 'retry',
          ),
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
          withAnalyzerQuota(firstClient, field, 2, async () =>
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
      assert.deepEqual(await getAnalyzerRemainingCounts(firstClient), {
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
        withAnalyzerQuota(firstClient, field, 2, async () => {
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
        withAnalyzerQuota(firstClient, field, 2, async () => {
          now = midnight;
          await withAnalyzerQuota(secondClient, field, 2, async () => {});
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
        withAnalyzerQuota(firstClient, field, 1, async () => {
          await redis.pexpire(userKey, 0);
          await withAnalyzerQuota(firstClient, field, 1, async () => {});
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
        withAnalyzerQuota(firstClient, field, 2, async () => {
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
        withAnalyzerQuota(firstClient, field, 2, async () => {
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
