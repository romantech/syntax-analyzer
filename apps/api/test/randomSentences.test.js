require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createServer } = require('../dist/config/createServer');

const servicesPath = require.resolve('../dist/services');
const openAIPath = require.resolve('@langchain/openai');
let llmCalls = 0;
let llmPrompt = '';
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
    ANALYZER_REDIS_SCHEMA: {
      KEYS: {
        PROMPT: 'prompt',
        REMAINING: { TOTAL: 'total', USER: (ip) => `user:${ip}` },
      },
      FIELDS: { ANALYSIS: 'analysis', RANDOM_SENTENCE: 'random_sentence' },
    },
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
            return { sentences: ['Generated sentence.'] };
          },
        };
      }
    },
  },
};

const {
  getRandomSentences,
} = require('../dist/controllers/analyzer/getRandomSentences');

test('validates generation queries before reserving quota', async (context) => {
  const app = createServer();
  app.get('/analyzer/random-sentences', ...getRandomSentences);
  app.use((error, _req, res, _next) => {
    res.status(500).json({ error: error.message });
  });

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
    ],
    [
      'bracketed topics',
      '?topics%5B%5D=sports&topics%5B%5D=travel',
      /sports.*travel/s,
    ],
  ];
  for (const [name, query, prompt] of validQueries) {
    await context.test(`accepts ${name}`, async () => {
      const previousCalls = llmCalls;
      const response = await fetch(`${url}${query}`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), ['Generated sentence.']);
      assert.equal(llmCalls, previousCalls + 1);
      assert.equal(quotaCalls, previousCalls + 1);
      assert.deepEqual(quotaDebit, { field: 'random_sentence', cost: 1 });
      assert.match(llmPrompt, prompt);
    });
  }
});
