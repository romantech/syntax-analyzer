require('module-alias/register');

const assert = require('node:assert/strict');
const { execFile, spawn } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { createConnection, createServer: createTcpServer } = require('node:net');
const { test } = require('node:test');
const { setTimeout: delay } = require('node:timers/promises');
const { promisify } = require('node:util');
const Redis = require('ioredis');
const { createServer } = require('../dist/config/createServer');
const { healthRouter } = require('../dist/routes/health');
const { robotsRouter } = require('../dist/routes/robots');

const execFileAsync = promisify(execFile);
const redisPort = process.env.REDIS_TEST_PORT;

test('serves public routes', async (context) => {
  const app = createServer();
  app.use('/', healthRouter);
  app.use(robotsRouter);

  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, (error) => {
      if (error) reject(error);
      else resolve(listener);
    });
  });
  context.after(() => server.close());

  const address = server.address();
  assert(address && typeof address !== 'string');
  const baseURL = `http://127.0.0.1:${address.port}`;

  const health = await fetch(`${baseURL}/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'OK');

  const robots = await fetch(`${baseURL}/robots.txt`);
  assert.equal(await robots.text(), 'User-agent: *\nDisallow: /');
});

test('reports Redis stalls and disconnects, then becomes ready after recovery', {
  skip: !redisPort,
  timeout: 15_000,
}, async (context) => {
  const host = '127.0.0.1';
  let accepting = true;
  const connections = new Map();
  const proxy = createTcpServer((socket) => {
    if (!accepting) {
      socket.destroy();
      return;
    }
    const upstream = createConnection(Number(redisPort), host);
    connections.set(socket, upstream);
    socket.on('error', () => upstream.destroy());
    upstream.on('error', () => socket.destroy());
    socket.on('close', () => {
      connections.delete(socket);
      upstream.destroy();
    });
    upstream.on('close', () => socket.destroy());
    socket.pipe(upstream).pipe(socket);
  });
  proxy.listen(0, host);
  await once(proxy, 'listening');
  context.after(() => {
    proxy.close();
    for (const socket of connections.keys()) socket.destroy();
  });

  const api = spawn(
    process.execPath,
    ['-r', 'module-alias/register', 'dist/server.js'],
    {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '0',
        OPENAI_API_KEY: 'test',
        REDIS_HOST: host,
        REDIS_PORT: String(proxy.address().port),
        REDIS_USERNAME: '',
        REDIS_PASSWORD: '',
      },
    },
  );
  const exited = once(api, 'exit');
  context.after(async () => {
    api.kill('SIGTERM');
    await exited;
  });

  let output = '';
  api.stdout.on('data', (data) => {
    output += data;
  });
  api.stderr.on('data', (data) => {
    output += data;
  });
  for (
    let attempt = 0;
    attempt < 200 && !output.includes('Server is running');
    attempt += 1
  ) {
    if (api.exitCode !== null) break;
    await delay(20);
  }
  const match = output.match(/Server is running on port (\d+)/);
  assert(match, output);
  const url = `http://${host}:${match[1]}`;
  const request = (path, timeout = 2_500) =>
    fetch(`${url}${path}`, { signal: AbortSignal.timeout(timeout) });
  const ready = async (status, body, timeout) => {
    const response = await request('/ready', timeout);
    assert.equal(response.status, status);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { status: body });
  };
  const waitForReady = async () => {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const response = await request('/ready');
      await response.json();
      if (response.status === 200) break;
      await delay(20);
    }
    await ready(200, 'OK');
  };
  await ready(200, 'OK');

  for (const upstream of connections.values()) upstream.pause();
  await Promise.all([ready(503, 'UNAVAILABLE'), ready(503, 'UNAVAILABLE')]);
  await ready(503, 'UNAVAILABLE', 750);
  assert.equal((await request('/health')).status, 200);
  for (const upstream of connections.values()) upstream.resume();
  await waitForReady();

  accepting = false;
  for (const socket of connections.keys()) socket.destroy();
  await ready(503, 'UNAVAILABLE');
  assert.equal((await request('/health')).status, 200);

  accepting = true;
  await waitForReady();
});

test('exits before listening when Redis rejects PING', {
  skip: !redisPort,
}, async (context) => {
  const redis = new Redis({ host: '127.0.0.1', port: Number(redisPort) });
  context.after(() => redis.disconnect());

  const username = `startup-${randomUUID()}`;
  const password = randomUUID();
  await redis.acl('SETUSER', username, 'on', `>${password}`, '+@all', '-ping');

  try {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        ['-r', 'module-alias/register', 'dist/server.js'],
        {
          env: {
            ...process.env,
            NODE_ENV: 'production',
            PORT: '0',
            OPENAI_API_KEY: 'test',
            REDIS_HOST: '127.0.0.1',
            REDIS_PORT: redisPort,
            REDIS_USERNAME: username,
            REDIS_PASSWORD: password,
          },
          timeout: 15_000,
        },
      ),
      (error) => {
        assert.equal(error.code, 1);
        const output = error.stdout + error.stderr;
        assert.match(output, /Failed to check the Redis connection/);
        assert.match(output, /redis-reply-error/);
        assert.doesNotMatch(output, /NOPERM/);
        assert.doesNotMatch(output, /Server is running/);
        return true;
      },
    );
  } finally {
    await redis.acl('DELUSER', username);
  }
});
