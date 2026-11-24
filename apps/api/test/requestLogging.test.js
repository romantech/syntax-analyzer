require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { ReplyError } = require('ioredis');
const { APIError } = require('openai');
const { startApp } = require('../test-support/app');
const { logger } = require('../dist/config/logger');

const sensitive = {
  sentence: 'PRIVATE_SENTENCE',
  topic: 'PRIVATE_TOPIC',
  header: 'PRIVATE_HEADER',
  requestId: 'PRIVATE_CLIENT_REQUEST_ID',
  path: 'PRIVATE_UNKNOWN_PATH',
  model: 'PRIVATE_MODEL_OUTPUT',
  providerError: 'PRIVATE_PROVIDER_ERROR',
  redisError: 'PRIVATE_REDIS_ERROR',
};
let quotaExhausted = false;

const createModel = () => ({
  pipe: () => ({
    invoke: async () => `{"value":"${sensitive.model}"} trailing`,
  }),
  withStructuredOutput: () => ({
    invoke: async () => {
      throw new APIError(503, { message: sensitive.providerError });
    },
  }),
  invoke: async () => ({ text: sensitive.model }),
});

test('logs only allowed request metadata across successful and failed requests', async (context) => {
  const records = [];
  const capture = (record) => records.push(record);
  logger.on('data', capture);
  context.after(() => logger.off('data', capture));

  const baseUrl = await startApp(context, {
    redis: {
      hget: async () => 'Generate sentences about {topics}',
      eval: async (_script, keyCount) => {
        if (keyCount === 2) throw new ReplyError(sensitive.redisError);
        return quotaExhausted ? 0 : 1;
      },
    },
    createModel,
  });
  const headers = {
    Authorization: `Bearer ${sensitive.header}`,
    'X-Request-Id': sensitive.requestId,
    'Content-Type': 'application/json',
  };
  const post = (body) => ({ method: 'POST', body });
  const analysis = post(
    JSON.stringify({ sentence: [sensitive.sentence, '.'], model: 'fast-ft' }),
  );
  const requestIds = new Set();
  const checkRequest = async ({
    url,
    options,
    status,
    level,
    path,
    errorType,
  }) => {
    const response = await fetch(`${baseUrl}${url}`, { ...options, headers });
    assert.equal(response.status, status);
    await response.json();

    const requestId = response.headers.get('X-Request-Id');
    assert.match(requestId, /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/);
    assert.equal(requestIds.has(requestId), false);
    requestIds.add(requestId);

    const matchingRecords = records.filter(
      (record) => record.requestId === requestId,
    );
    assert.equal(matchingRecords.length, 1);
    const [record] = matchingRecords;
    assert.equal(record[Symbol.for('level')], level);
    assert.equal(record.method, options?.method ?? 'GET');
    assert.equal(record.path, path ?? url);
    assert.equal(record.status, status);
    assert.equal(record.errorType, errorType);
    assert(Number.isFinite(record.durationMs) && record.durationMs >= 0);
  };

  await checkRequest({ url: '/health', status: 200, level: 'info' });
  await checkRequest({
    url: '/analyzer',
    options: post(`{"sentence":["${sensitive.sentence}",`),
    status: 400,
    level: 'warn',
    errorType: 'invalid-request-body',
  });
  quotaExhausted = true;
  await checkRequest({
    url: '/analyzer',
    options: analysis,
    status: 400,
    level: 'warn',
    errorType: 'application-error',
  });
  quotaExhausted = false;
  await checkRequest({
    url: '/analyzer',
    options: analysis,
    status: 500,
    level: 'error',
    errorType: 'model-json-repair-failed',
  });
  await checkRequest({
    url: `/analyzer/random-sentences?topics=${sensitive.topic}`,
    path: '/analyzer/random-sentences',
    status: 500,
    level: 'error',
    errorType: 'model-api-error',
  });
  await checkRequest({
    url: '/analyzer/remaining-counts',
    status: 500,
    level: 'error',
    errorType: 'redis-reply-error',
  });
  await checkRequest({
    url: `/${sensitive.path}`,
    path: '<unmatched>',
    status: 404,
    level: 'warn',
    errorType: 'application-error',
  });

  assert.equal(records.length, requestIds.size);
  const logs = records
    .map((record) => record[Symbol.for('message')])
    .join('\n');
  for (const value of Object.values(sensitive)) {
    assert.equal(
      logs.includes(value),
      false,
      `Unexpected log field for ${value}`,
    );
  }
});
