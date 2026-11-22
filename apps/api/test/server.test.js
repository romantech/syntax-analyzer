require('module-alias/register');

const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');
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
        assert.match(output, /NOPERM/);
        assert.doesNotMatch(output, /Server is running/);
        return true;
      },
    );
  } finally {
    await redis.acl('DELUSER', username);
  }
});
