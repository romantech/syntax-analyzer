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

const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;
const redisPort = process.env.REDIS_TEST_PORT;
const clientIP = '127.0.0.1';
const completedAnalysis = { analysis: 'completed' };

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
    [FIELDS.ANALYSIS]: 'Analyze this sentence.',
    [FIELDS.RANDOM_SENTENCE]: 'Write {sent_count} sentences about {topics}.',
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
      NODE_ENV: 'production',
      PORT: '0',
      OPENAI_API_KEY: 'test-key',
      OPENAI_API_BASE: `${modelURL}/v1`,
      REDIS_HOST: clientIP,
      REDIS_PORT: redisPort,
      REDIS_USERNAME: '',
      REDIS_PASSWORD: '',
      MODEL_PRIMARY: 'gpt-4.1',
      MODEL_FAST: 'gpt-4.1-mini',
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
    body: JSON.stringify({ model: 'primary', sentence: ['She', 'reads', '.'] }),
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

test('model retries, JSON repair and client disconnect use the request cancellation signal', {
  skip: !redisPort,
  timeout: 12_000,
}, async (context) => {
  const { redis, prefix, model, env, readQuota } = await fixture(context);
  Object.assign(process.env, env);
  const { createServer } = require('../dist/config/createServer');
  const { AnalyzerRequests } = require('../dist/services/analyzerRequests');
  const { redis: appRedis } = require('../dist/services/redis/redis');
  const { setupRoutes } = require('../dist/routes');
  const { errorHandler } = require('../dist/middlewares/errorHandler');
  appRedis.options.keyPrefix = prefix;
  context.after(() => appRedis.disconnect());

  const app = createServer(new AnalyzerRequests(1_500));
  setupRoutes(app);
  app.use(errorHandler);
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
  const repairCall = nextModelResponse(model);
  complete(first, '');
  const repair = await repairCall;
  const repairClosed = once(repair, 'close');
  const repairStarted = performance.now();
  const timedOut = await analysis;
  assert.equal(timedOut.status, 504);
  assert.deepEqual(await timedOut.json(), {
    status: 'error',
    message: 'Analyzer request timed out.',
  });
  await repairClosed;
  assert(
    performance.now() - repairStarted < 1_300,
    'repair shares the original deadline',
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
    initialAnalysis.map((value) => String(Number(value) - 2)),
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
    require('./dist/services/redis/redis').redis.options.keyPrefix = process.env.TEST_REDIS_PREFIX;
    require('./dist/server');
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
    before.map((value) => String(Number(value) - 4)),
  );

  const shutdownStarted = performance.now();
  assert(child.kill('SIGTERM'));
  await waitForLog(/Server is shutting down/);
  const newConnection = createConnection(Number(port), clientIP);
  context.after(() => newConnection.destroy());
  await assert.rejects(once(newConnection, 'connect'), {
    code: 'ECONNREFUSED',
  });

  complete(finishedModel, JSON.stringify(completedAnalysis));
  const success = await finishing;
  assert.equal(success.status, 200);
  assert.deepEqual(await success.json(), completedAnalysis);

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
    before.map((value) => String(Number(value) - 2)),
  );
  assert.equal(
    (await redis.keys(`${prefix}${KEYS.REMAINING.RESERVATION('*')}`)).length,
    1,
  );
});
