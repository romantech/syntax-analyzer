require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createServer } = require('../dist/config/createServer');

const servicesPath = require.resolve('../dist/services');
const openAIPath = require.resolve('@langchain/openai');
let llmCalls = 0;
let llmPrompt = '';

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
    decrementRedisCounters: async () => {},
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

test('uses sanitized defaults and bracketed topic arrays', async (context) => {
  const [maxChars, topics, sentenceCount, , validationErrors, handler] =
    getRandomSentences;
  const app = createServer();
  app.get(
    '/analyzer/random-sentences',
    maxChars,
    topics,
    sentenceCount,
    (req, _res, next) => {
      req.clientIP = '127.0.0.1';
      next();
    },
    validationErrors,
    handler,
  );
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
  const response = await fetch(
    `http://127.0.0.1:${address.port}/analyzer/random-sentences?sent_count=3&topics%5B%5D=sports&topics%5B%5D=travel`,
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), ['Generated sentence.']);
  assert.equal(llmCalls, 1);
  assert.match(llmPrompt, /sports/);
  assert.match(llmPrompt, /travel/);
});
