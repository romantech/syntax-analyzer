require('module-alias/register');

const { once } = require('node:events');
const { createServer } = require('../dist/config/createServer');

const models = {
  fast: 'test-fast',
  primary: 'test-primary',
  'fast-ft': 'test-fast-ft',
  'primary-ft': 'test-primary-ft',
};

const startApp = async (context, options = {}) => {
  const app = createServer({
    corsOrigins: [],
    isKoyeb: false,
    models,
    redis: {},
    createModel: () => {
      throw new Error('Unexpected model call in test');
    },
    ...options,
  });
  const server = app.listen(0, '127.0.0.1');
  context.after(() => server.close());
  await once(server, 'listening');
  return `http://127.0.0.1:${server.address().port}`;
};

module.exports = { startApp };
