require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { ReplyError } = require('ioredis');
const { APIError } = require('openai');
const { createServer } = require('../dist/config/createServer');
const { logger } = require('../dist/config/logger');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');
const { throwCustomError } = require('../dist/utils/customError');

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

require.cache[require.resolve('@langchain/openai')] = {
  exports: {
    ChatOpenAI: class {
      pipe() {
        return {
          invoke: async () => `{"value":"${sensitive.model}"} trailing`,
        };
      }

      withStructuredOutput() {
        return {
          invoke: async () => {
            throw new APIError(503, { message: sensitive.providerError });
          },
        };
      }

      async invoke() {
        return { text: sensitive.model };
      }
    },
  },
};
const services = {
  AI_MODEL: { fast: 'test-model' },
  AIModelKey: { FAST: 'fast', FAST_FT: 'fast-ft', PRIMARY: 'primary' },
  ANALYSIS_MODEL: ['fast-ft'],
  ANALYSIS_MODEL_OPTION: { 'fast-ft': { promptField: 'analysis' } },
  ANALYZER_REDIS_SCHEMA,
  RANDOM_SENTENCE_CONFIG: {},
  redis: { hget: async () => 'Generate sentences about {topics}' },
  withAnalyzerQuota: async (_ip, _field, _cost, run) => {
    if (quotaExhausted)
      throwCustomError('No remaining request count available.', 400);
    return run();
  },
  getAnalyzerRemainingCounts: async () => {
    throw new ReplyError(sensitive.redisError);
  },
};
require.cache[require.resolve('../dist/services')] = { exports: services };
Object.assign(services, require('../dist/services/openAI/openAIUtils'));

const { errorHandler, notFoundHandler } = require('../dist/middlewares');
const { setupRoutes } = require('../dist/routes');

test('logs only allowed request metadata across successful and failed requests', async (context) => {
  const records = [];
  const capture = (record) => records.push(record);
  logger.on('data', capture);
  context.after(() => logger.off('data', capture));

  const app = createServer();
  setupRoutes(app);
  app.use(notFoundHandler, errorHandler);
  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, '127.0.0.1', (error) => {
      if (error) reject(error);
      else resolve(listener);
    });
  });
  context.after(() => server.close());

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
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
