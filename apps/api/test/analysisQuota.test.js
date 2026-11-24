require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  startApp,
  modelAnalysis,
  analysisPromptValues,
} = require('../test-support/app');

const balances = { total: 0, user: 0 };
let modelCalls = 0;
let quotaCalls = 0;
let requestedModel;
const debits = [];

test('validates analysis requests before reserving quota', async (context) => {
  const baseURL = await startApp(context, {
    redis: {
      hmget: async () => analysisPromptValues,
      eval: async (_script, keyCount, _totalKey, userKey, ...args) => {
        quotaCalls += 1;
        assert.equal(keyCount, 4);
        assert.equal(userKey, 'analyzer:remaining:user:127.0.0.1');
        const [field, cost] = args.slice(-2);
        if (balances.total < cost || balances.user < cost) return 0;
        debits.push({ field, cost });
        return 1;
      },
    },
    createModel: ({ model }) => ({
      invoke: async () => {
        modelCalls += 1;
        requestedModel = model;
        return modelAnalysis();
      },
    }),
  });
  const url = `${baseURL}/analyzer`;
  const validBody = { model: 'fast-ft', sentence: ['She', 'reads', '.'] };
  const post = (body) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

  const invalidFields = [
    ['numeric token', { sentence: ['She', 42] }, 'sentence'],
    ['blank token', { sentence: ['She', ' '] }, 'sentence'],
    ['long token', { sentence: ['She', 'a'.repeat(81)] }, 'sentence'],
    ['array model', { model: ['fast-ft'] }, 'model'],
    ['unknown model', { model: 'unknown' }, 'model'],
  ];
  for (const [name, fields, path] of invalidFields) {
    await context.test(`rejects ${name}`, async () => {
      const response = await post(JSON.stringify({ ...validBody, ...fields }));
      assert.equal(response.status, 400);
      const { errors } = await response.json();
      assert.deepEqual(
        errors.map((error) => error.path),
        [path],
      );
      assert.equal(quotaCalls, 0);
      assert.equal(modelCalls, 0);
    });
  }

  const invalidBodies = [
    ['malformed JSON', '{"sentence":', 400, 'Invalid request body.'],
    [
      'oversized JSON',
      JSON.stringify({
        ...validBody,
        sentence: ['She', 'a'.repeat(100 * 1024)],
      }),
      413,
      'Request body too large.',
    ],
  ];
  for (const [name, body, status, message] of invalidBodies) {
    await context.test(`rejects ${name}`, async () => {
      const response = await post(body);
      assert.equal(response.status, status);
      assert.deepEqual(await response.json(), { status: 'error', message });
      assert.equal(quotaCalls, 0);
      assert.equal(modelCalls, 0);
    });
  }

  const cases = [
    { model: 'primary', total: 0, user: 1, expectedCost: 0 },
    { model: 'primary-ft', total: 1, user: 0, expectedCost: 0 },
    { model: 'primary', total: 1, user: 1, expectedCost: 1 },
    { model: 'primary-ft', total: 1, user: 1, expectedCost: 1 },
    { model: 'fast-ft', total: 1, user: 1, expectedCost: 1 },
  ];

  for (const { model, total, user, expectedCost } of cases) {
    await context.test(
      `${model} with total ${total} and user ${user}`,
      async () => {
        Object.assign(balances, { total, user });
        modelCalls = 0;
        debits.length = 0;

        const response = await post(JSON.stringify({ ...validBody, model }));

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
          assert.deepEqual(
            (await response.json()).sentence,
            validBody.sentence,
          );
          assert.equal(modelCalls, 1);
          assert.equal(requestedModel, 'test-analysis');
          assert.deepEqual(debits, [{ field: 'analysis', cost: expectedCost }]);
        }
      },
    );
  }
});
