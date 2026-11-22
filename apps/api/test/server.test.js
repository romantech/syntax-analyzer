require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createServer } = require('../dist/config/createServer');
const { healthRouter } = require('../dist/routes/health');
const { robotsRouter } = require('../dist/routes/robots');

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
