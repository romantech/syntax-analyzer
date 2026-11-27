require('module-alias/register');

const { once } = require('node:events');
const { createServer } = require('../dist/config/createServer');

const models = {
  fast: 'test-fast',
  analysis: 'test-analysis',
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

const modelAnalysis = () => ({
  response_metadata: { finish_reason: 'stop' },
  text: '{"spans":[{"begin":0,"end":1,"tags":["subject"]}]}',
});

const analysisPromptValues = [
  'Fixture analysis prompt.',
  'Fixture retry instruction.',
];

module.exports = { startApp, modelAnalysis, analysisPromptValues };
