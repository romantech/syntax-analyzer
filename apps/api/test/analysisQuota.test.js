require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createServer } = require('../dist/config/createServer');

const balances = { total: 0, user: 0 };
let modelCalls = 0;
const debits = [];
const analysis = { id: 'analysis-result' };

require.cache[require.resolve('../dist/services')] = {
  exports: {
    AIModelKey: {
      FAST: 'fast',
      PRIMARY: 'primary',
      FAST_FT: 'fast-ft',
      PRIMARY_FT: 'primary-ft',
    },
    ANALYSIS_MODEL: ['primary', 'primary-ft', 'fast-ft'],
    ANALYSIS_MODEL_OPTION: {
      primary: { promptField: 'analysis' },
      'primary-ft': { promptField: 'analysis_fine_tuned' },
      'fast-ft': { promptField: 'analysis_fine_tuned' },
    },
    ANALYZER_REDIS_SCHEMA: {
      KEYS: {
        PROMPT: 'prompt',
        REMAINING: { TOTAL: 'total', USER: () => 'user' },
      },
      FIELDS: { ANALYSIS: 'analysis', RANDOM_SENTENCE: 'random_sentence' },
    },
    redis: {
      hget: async () => 'Analyze this sentence',
    },
    createJSONChatOpenAI: () => ({
      pipe: () => ({
        invoke: async () => {
          modelCalls += 1;
          return JSON.stringify(analysis);
        },
      }),
    }),
    validateAndRepairJSON: JSON.parse,
    withAnalyzerQuota: async (ip, field, cost, run) => {
      assert.equal(ip, '127.0.0.1');
      if (balances.total < cost || balances.user < cost) {
        const { throwCustomError } = require('../dist/utils/customError');
        throwCustomError('No remaining request count available.', 400);
      }
      debits.push({ field, cost });
      return run();
    },
  },
};

const {
  createAnalysis,
} = require('../dist/controllers/analyzer/createAnalysis');
const { errorHandler } = require('../dist/middlewares/errorHandler');

test('passes the selected analysis model cost to the quota service', async (context) => {
  const app = createServer();
  app.post('/analyzer', ...createAnalysis);
  app.use(errorHandler);

  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, '127.0.0.1', (error) => {
      if (error) reject(error);
      else resolve(listener);
    });
  });
  context.after(() => server.close());

  const address = server.address();
  assert(address && typeof address !== 'string');
  const url = `http://127.0.0.1:${address.port}/analyzer`;
  const cases = [
    { model: 'primary', total: 1, user: 2, expectedCost: 0 },
    { model: 'primary-ft', total: 2, user: 1, expectedCost: 0 },
    { model: 'primary', total: 2, user: 2, expectedCost: 2 },
    { model: 'fast-ft', total: 1, user: 1, expectedCost: 1 },
  ];

  for (const { model, total, user, expectedCost } of cases) {
    await context.test(
      `${model} with total ${total} and user ${user}`,
      async () => {
        Object.assign(balances, { total, user });
        modelCalls = 0;
        debits.length = 0;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, sentence: ['She', 'reads', '.'] }),
        });

        if (expectedCost === 0) {
          assert.equal(response.status, 400);
          assert.deepEqual(await response.json(), {
            status: 'error',
            message: 'No remaining request count available.',
          });
          assert.equal(modelCalls, 0);
          assert.deepEqual(debits, []);
        } else {
          assert.equal(response.status, 200);
          assert.deepEqual(await response.json(), analysis);
          assert.equal(modelCalls, 1);
          assert.deepEqual(debits, [{ field: 'analysis', cost: expectedCost }]);
        }
      },
    );
  }
});
