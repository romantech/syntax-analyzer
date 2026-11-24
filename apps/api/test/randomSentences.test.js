require('module-alias/register');

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');
const Redis = require('ioredis');
const { createServer } = require('../dist/config/createServer');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');

const servicesPath = require.resolve('../dist/services');
const openAIPath = require.resolve('@langchain/openai');
const redisPort = process.env.REDIS_TEST_PORT;
const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;
const defaultSentences = ['I walk.', 'We read.', 'Birds fly.'];
let llmCalls = 0;
let llmPrompt = '';
let modelSentences = defaultSentences;
let quotaCalls = 0;
let quotaDebit;

require.cache[servicesPath] = {
  exports: {
    AIModelKey: {
      FAST: 'fast',
      PRIMARY: 'primary',
      FAST_FT: 'fast-ft',
      PRIMARY_FT: 'primary-ft',
    },
    ANALYSIS_MODEL: [],
    ANALYZER_REDIS_SCHEMA,
    RANDOM_SENTENCE_CONFIG: {},
    withAnalyzerQuota: async (_ip, field, cost, run) => {
      quotaCalls += 1;
      quotaDebit = { field, cost };
      return run();
    },
    redis: {
      hget: async () =>
        'Generate {sent_count} sentences with up to {max_chars} characters about {topics}',
    },
  },
};
require.cache[openAIPath] = {
  exports: {
    ChatOpenAI: class {
      withStructuredOutput() {
        return {
          invoke: async (prompt) => {
            llmCalls += 1;
            llmPrompt = prompt.toString();
            return { sentences: modelSentences };
          },
        };
      }
    },
  },
};

const {
  getRandomSentences,
} = require('../dist/controllers/analyzer/getRandomSentences');
const { errorHandler } = require('../dist/middlewares/errorHandler');

test('random sentence generation', async (context) => {
  const app = createServer();
  app.get('/analyzer/random-sentences', ...getRandomSentences);
  app.use(errorHandler);

  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, (error) => {
      if (error) reject(error);
      else resolve(listener);
    });
  });
  context.after(() => server.close());

  const address = server.address();
  assert(address && typeof address !== 'string');
  const url = `http://127.0.0.1:${address.port}/analyzer/random-sentences`;
  const maxLengthQuery = '?sent_count=3&max_chars=10';
  const invalidQueries = [
    ['sent_count=1.5', 'sent_count'],
    ['max_chars=10.5', 'max_chars'],
    ['sent_count=3abc', 'sent_count'],
    ['sent_count=3&sent_count=4', 'sent_count'],
    ['max_chars=', 'max_chars'],
    ['sent_count=6', 'sent_count'],
    ['max_chars=9', 'max_chars'],
    ['topics%5Bname%5D=sports', 'topics'],
    ['topics=%20', 'topics'],
    [`topics=${'a'.repeat(21)}`, 'topics'],
    ['topics=A&topics=B&topics=C&topics=D', 'topics'],
  ];
  for (const [query, path] of invalidQueries) {
    await context.test(`rejects ${query}`, async () => {
      const response = await fetch(`${url}?${query}`);
      assert.equal(response.status, 400);
      const { errors } = await response.json();
      assert.deepEqual(
        errors.map((error) => error.path),
        [path],
      );
      assert.equal(quotaCalls, 0);
      assert.equal(llmCalls, 0);
    });
  }

  const validQueries = [
    [
      'omitted query',
      '',
      /Generate 3 sentences with up to 80 characters about \[\]/,
    ],
    ['single topic', '?topics=X', /X/],
    [
      'repeated topics',
      '?sent_count=5&max_chars=10&topics=sports&topics=travel',
      /Generate 5 sentences with up to 10 characters about .*sports.*travel/s,
      [...defaultSentences, 'I eat.', ' We sing. '],
    ],
    [
      'bracketed topics',
      '?topics%5B%5D=sports&topics%5B%5D=travel',
      /sports.*travel/s,
    ],
  ];
  for (const [
    name,
    query,
    prompt,
    sentences = defaultSentences,
  ] of validQueries) {
    await context.test(`accepts ${name}`, async () => {
      modelSentences = sentences;
      const previousCalls = llmCalls;
      const response = await fetch(`${url}${query}`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), sentences);
      assert.equal(llmCalls, previousCalls + 1);
      assert.equal(quotaCalls, previousCalls + 1);
      assert.deepEqual(quotaDebit, { field: 'random_sentence', cost: 1 });
      assert.match(llmPrompt, prompt);
    });
  }

  const invalidResults = [
    ['too few sentences', ['I walk.']],
    ['too many sentences', [...defaultSentences, 'I eat.']],
    ['an empty sentence', ['', ...defaultSentences.slice(1)]],
    ['a whitespace-only sentence', [' \t\n', ...defaultSentences.slice(1)]],
    ['an overlong sentence', ['Birds sing.', ...defaultSentences.slice(1)]],
  ];
  for (const [name, sentences] of invalidResults) {
    await context.test(`rejects ${name} returned by the model`, async () => {
      modelSentences = sentences;
      const response = await fetch(`${url}${maxLengthQuery}`);
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json(), {
        status: 'error',
        message: 'Invalid generated sentences.',
      });
    });
  }

  await context.test(
    'refunds the IP and shared Redis quotas for an invalid generation',
    { skip: !redisPort },
    async (testContext) => {
      const prefix = `random-sentences-test:${randomUUID()}:`;
      const redis = new Redis({
        host: '127.0.0.1',
        port: Number(redisPort),
        keyPrefix: prefix,
        maxRetriesPerRequest: 0,
        retryStrategy: () => null,
      });
      testContext.after(async () => {
        try {
          if (redis.status === 'ready') {
            const keys = await redis.keys(`${prefix}*`);
            if (keys.length)
              await redis.del(...keys.map((key) => key.slice(prefix.length)));
          }
        } finally {
          redis.disconnect();
        }
      });
      require.cache[require.resolve('../dist/services/redis/redis')] = {
        exports: { redis },
      };
      const {
        getAnalyzerRemainingCounts,
        withAnalyzerQuota,
      } = require('../dist/services/redis/analyzerQuota');
      testContext.mock.method(
        require.cache[servicesPath].exports,
        'withAnalyzerQuota',
        withAnalyzerQuota,
      );

      const clientIP = '192.0.2.1';
      const field = FIELDS.RANDOM_SENTENCE;
      const readBalances = () =>
        Promise.all([
          redis.hget(KEYS.REMAINING.USER(clientIP), field),
          redis.hget(KEYS.REMAINING.TOTAL, field),
        ]);
      await getAnalyzerRemainingCounts(clientIP);
      const before = await readBalances();
      const headers = { 'x-forwarded-for': clientIP };

      modelSentences = defaultSentences;
      const valid = await fetch(`${url}${maxLengthQuery}`, { headers });
      assert.equal(valid.status, 200);
      assert.deepEqual(await valid.json(), defaultSentences);
      const afterSuccess = before.map((balance) => String(Number(balance) - 1));
      assert.deepEqual(await readBalances(), afterSuccess);

      modelSentences = ['A sentence that is too long.'];
      const invalid = await fetch(`${url}${maxLengthQuery}`, { headers });
      assert.equal(invalid.status, 502);
      await invalid.json();
      assert.deepEqual(await readBalances(), afterSuccess);
    },
  );
});
