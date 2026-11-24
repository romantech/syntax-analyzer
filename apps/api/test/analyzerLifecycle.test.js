require('module-alias/register');

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { createServer: createHttpServer } = require('node:http');
const { createConnection } = require('node:net');
const { test } = require('node:test');
const { setTimeout: delay } = require('node:timers/promises');
const Redis = require('ioredis');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');
const { analysisPromptValues } = require('../test-support/app');

const { KEYS, FIELDS, PROMPT_FIELDS } = ANALYZER_REDIS_SCHEMA;
const redisPort = process.env.REDIS_TEST_PORT;
const clientIP = '127.0.0.1';
const analysisSentence = ['She', 'reads', '.'];

const listen = async (server) => {
  server.listen(0, clientIP);
  await once(server, 'listening');
  return `http://${clientIP}:${server.address().port}`;
};

const fixture = async (context) => {
  const prefix = `analyzer-lifecycle-test:${randomUUID()}:`;
  const redis = new Redis({
    host: clientIP,
    port: Number(redisPort),
    keyPrefix: prefix,
  });
  context.after(async () => {
    try {
      const keys = await redis.keys(`${prefix}*`);
      if (keys.length)
        await redis.del(...keys.map((key) => key.slice(prefix.length)));
    } finally {
      redis.disconnect();
    }
  });
  await redis.hset(KEYS.PROMPT, {
    [FIELDS.RANDOM_SENTENCE]: 'Write {sent_count} sentences about {topics}.',
    [PROMPT_FIELDS.STRUCTURED_ANALYSIS]: analysisPromptValues[0],
    [PROMPT_FIELDS.STRUCTURED_ANALYSIS_RETRY]: analysisPromptValues[1],
  });

  const model = createHttpServer((req) => req.resume());
  const modelURL = await listen(model);
  context.after(() => {
    model.close();
    model.closeAllConnections();
  });

  return {
    redis,
    prefix,
    model,
    env: {
      NODE_ENV: 'test',
      PORT: '0',
      OPENAI_API_KEY: 'test-key',
      OPENAI_API_BASE: `${modelURL}/v1`,
      REDIS_HOST: clientIP,
      REDIS_PORT: redisPort,
      REDIS_USERNAME: '',
      REDIS_PASSWORD: '',
      MODEL_FAST: 'gpt-6-luna',
      MODEL_ANALYSIS_BASIC: 'gpt-6-luna',
      KOYEB_APP_ID: '',
    },
    readQuota: (field) =>
      Promise.all([
        redis.hget(KEYS.REMAINING.TOTAL, field),
        redis.hget(KEYS.REMAINING.USER(clientIP), field),
      ]),
  };
};

const analyze = (url, { headers, signal } = {}) =>
  fetch(`${url}/analyzer`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'primary', sentence: analysisSentence }),
    signal,
  });

const nextModelResponse = async (model) => {
  const [, response] = await once(model, 'request');
  return response;
};

const complete = (response, content) => {
  response.setHeader('Content-Type', 'application/json');
  response.end(
    JSON.stringify({
      id: 'chatcmpl-test',
      object: 'chat.completion',
      created: 0,
      model: 'gpt-4.1',
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content },
          finish_reason: 'stop',
        },
      ],
    }),
  );
};

test('model retries, range validation and client disconnect use the request cancellation signal', {
  skip: !redisPort,
  timeout: 12_000,
}, async (context) => {
  const { redis, prefix, model, env, readQuota } = await fixture(context);
  const previousBaseURL = process.env.OPENAI_API_BASE;
  process.env.OPENAI_API_BASE = env.OPENAI_API_BASE;
  context.after(() => {
    if (previousBaseURL === undefined) delete process.env.OPENAI_API_BASE;
    else process.env.OPENAI_API_BASE = previousBaseURL;
  });
  const { createServer } = require('../dist/config/createServer');
  const { loadEnvironment } = require('../dist/config/environment');
  const { AnalyzerRequests } = require('../dist/services/analyzerRequests');
  const { createChatOpenAI } = require('../dist/services/openAI/openAIUtils');
  const config = loadEnvironment(env);
  const app = createServer({
    corsOrigins: config.corsOrigins,
    isKoyeb: config.isKoyeb,
    models: config.models,
    redis,
    createModel: createChatOpenAI(config.openAIKey),
    analyzerRequests: new AnalyzerRequests(1_500),
  });
  const server = createHttpServer(app);
  const url = await listen(server);
  context.after(() => {
    server.close();
    server.closeAllConnections();
  });
  assert.equal((await fetch(`${url}/analyzer/remaining-counts`)).status, 200);
  const initialAnalysis = await readQuota(FIELDS.ANALYSIS);
  const initialSentences = await readQuota(FIELDS.RANDOM_SENTENCE);

  const firstCall = nextModelResponse(model);
  const analysis = analyze(url);
  const first = await firstCall;
  await delay(700);
  const analysisRetryCall = nextModelResponse(model);
  complete(
    first,
    JSON.stringify({ spans: [{ begin: 0, end: 5, tags: ['subject'] }] }),
  );
  const analysisRetry = await analysisRetryCall;
  const analysisRetryClosed = once(analysisRetry, 'close');
  const analysisRetryStarted = performance.now();
  const timedOut = await analysis;
  assert.equal(timedOut.status, 504);
  assert.deepEqual(await timedOut.json(), {
    status: 'error',
    message: 'Analyzer request timed out.',
  });
  await analysisRetryClosed;
  assert(
    performance.now() - analysisRetryStarted < 1_300,
    'the second analysis shares the original deadline',
  );
  assert.deepEqual(await readQuota(FIELDS.ANALYSIS), initialAnalysis);

  const generationCall = nextModelResponse(model);
  const generation = fetch(`${url}/analyzer/random-sentences`);
  const retryable = await generationCall;
  const retryCall = nextModelResponse(model);
  retryable.writeHead(503, {
    'Content-Type': 'application/json',
    'Retry-After': '0',
  });
  retryable.end(JSON.stringify({ error: { message: 'Temporary test error' } }));
  const retry = await retryCall;
  const retryClosed = once(retry, 'close');
  assert.equal((await generation).status, 504);
  await retryClosed;
  assert.deepEqual(await readQuota(FIELDS.RANDOM_SENTENCE), initialSentences);

  const abort = new AbortController();
  const disconnectedCall = nextModelResponse(model);
  const disconnected = analyze(url, { signal: abort.signal });
  const clientModelResponse = await disconnectedCall;
  const disconnectedModel = once(clientModelResponse, 'close');
  assert.deepEqual(
    await readQuota(FIELDS.ANALYSIS),
    initialAnalysis.map((value) => String(Number(value) - 1)),
  );
  abort.abort();
  await assert.rejects(disconnected, { name: 'AbortError' });
  await disconnectedModel;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (
      !(await redis.keys(`${prefix}${KEYS.REMAINING.RESERVATION('*')}`)).length
    )
      break;
    await delay(20);
  }
  assert.deepEqual(await readQuota(FIELDS.ANALYSIS), initialAnalysis);
});

test('SIGTERM stops accepting connections and refunds only unfinished requests', {
  skip: !redisPort,
  timeout: 30_000,
}, async (context) => {
  const { redis, prefix, model, env, readQuota } = await fixture(context);
  const child = spawn(
    process.execPath,
    [
      '-r',
      'module-alias/register',
      '-e',
      `
    const Redis = require('ioredis');
    const { loadEnvironment } = require('./dist/config/environment');
    const { startServer } = require('./dist/config/startServer');
    const config = loadEnvironment(process.env);
    const redis = new Redis({ ...config.redis, protocol: 2, keyPrefix: process.env.TEST_REDIS_PREFIX });
    void startServer(config, redis);
  `,
    ],
    {
      env: {
        ...process.env,
        ...env,
        TEST_REDIS_PREFIX: prefix,
        KOYEB_APP_ID: 'test',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  const exited = once(child, 'exit');
  context.after(async () => {
    if (child.exitCode === null && child.signalCode === null)
      child.kill('SIGKILL');
    await exited;
  });

  let output = '';
  child.stdout.on('data', (data) => {
    output += data;
  });
  child.stderr.on('data', (data) => {
    output += data;
  });
  const waitForLog = async (pattern) => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const match = output.match(pattern);
      if (match) return match;
      if (child.exitCode !== null || child.signalCode !== null) break;
      await delay(20);
    }
    assert.fail(`Server did not log ${pattern}: ${output}`);
  };

  const [, port] = await waitForLog(/Server is running on port (\d+)/);
  const url = `http://${clientIP}:${port}`;
  const headers = { 'X-Forwarded-For': clientIP };
  assert.equal(
    (await fetch(`${url}/analyzer/remaining-counts`, { headers })).status,
    200,
  );
  const before = await readQuota(FIELDS.ANALYSIS);

  const finishingCall = nextModelResponse(model);
  const finishing = analyze(url, { headers });
  const finishedModel = await finishingCall;
  const unfinishedCall = nextModelResponse(model);
  const unfinished = analyze(url, { headers });
  const unfinishedModel = await unfinishedCall;
  const upstreamClosed = once(unfinishedModel, 'close');
  assert.deepEqual(
    await readQuota(FIELDS.ANALYSIS),
    before.map((value) => String(Number(value) - 2)),
  );

  const shutdownStarted = performance.now();
  assert(child.kill('SIGTERM'));
  await waitForLog(/Server is shutting down/);
  const newConnection = createConnection(Number(port), clientIP);
  context.after(() => newConnection.destroy());
  await assert.rejects(once(newConnection, 'connect'), {
    code: 'ECONNREFUSED',
  });

  complete(finishedModel, JSON.stringify({ spans: [] }));
  const success = await finishing;
  assert.equal(success.status, 200);
  assert.deepEqual((await success.json()).sentence, analysisSentence);

  const cancelled = await unfinished;
  assert.equal(cancelled.status, 503);
  assert.deepEqual(await cancelled.json(), {
    status: 'error',
    message: 'Server is shutting down.',
  });
  await upstreamClosed;
  assert.deepEqual(await exited, [0, null], output);
  assert(performance.now() - shutdownStarted < 25_000);
  assert.deepEqual(
    await readQuota(FIELDS.ANALYSIS),
    before.map((value) => String(Number(value) - 1)),
  );
  assert.equal(
    (await redis.keys(`${prefix}${KEYS.REMAINING.RESERVATION('*')}`)).length,
    1,
  );
});
