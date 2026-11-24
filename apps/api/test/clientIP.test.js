require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createServer } = require('../dist/config/createServer');
const { envConfig } = require('../dist/config/environment');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');

const { FIELDS, KEYS } = ANALYZER_REDIS_SCHEMA;
const analysis = { id: 'analysis-result' };
const sentences = ['I walk.'];
const counts = { analysis: 4, random_sentence: 3 };
const quotaKeys = [];

require.cache[require.resolve('../dist/services')] = {
  exports: {
    AIModelKey: {
      FAST: 'fast',
      PRIMARY: 'primary',
      FAST_FT: 'fast-ft',
      PRIMARY_FT: 'primary-ft',
    },
    ANALYSIS_MODEL: ['primary'],
    ANALYZER_REDIS_SCHEMA,
    withAnalyzerQuota: async (ip, field) => {
      quotaKeys.push(KEYS.REMAINING.USER(ip));
      return field === FIELDS.ANALYSIS ? analysis : sentences;
    },
    getAnalyzerRemainingCounts: async (ip) => {
      quotaKeys.push(KEYS.REMAINING.USER(ip));
      return counts;
    },
  },
};

const { setupRoutes } = require('../dist/routes');
const { errorHandler } = require('../dist/middlewares/errorHandler');

test('analyzer endpoints use the same quota IP policy', async (context) => {
  const app = createServer();
  setupRoutes(app);
  app.use(errorHandler);

  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, '127.0.0.1', (error) => {
      if (error) reject(error);
      else resolve(listener);
    });
  });
  context.after(() => server.close());

  const address = server.address();
  assert(address && typeof address !== 'string');
  const baseURL = `http://127.0.0.1:${address.port}/analyzer`;
  const requests = [
    {
      path: '',
      method: 'POST',
      body: JSON.stringify({ model: 'primary', sentence: ['I', 'walk.'] }),
      expected: analysis,
    },
    { path: '/random-sentences?sent_count=1', expected: sentences },
    { path: '/remaining-counts', expected: counts },
  ];

  const cases = [
    { name: 'direct connection', isKoyeb: false, ip: '127.0.0.1' },
    {
      name: 'direct connection with forwarding metadata',
      isKoyeb: false,
      forwardedFor: '192.0.2.10, 198.51.100.8',
      ip: '127.0.0.1',
    },
    {
      name: 'Koyeb edge with IPv4',
      isKoyeb: true,
      forwardedFor: '192.0.2.10, 198.51.100.8',
      ip: '198.51.100.8',
    },
    {
      name: 'Koyeb edge with IPv6',
      isKoyeb: true,
      forwardedFor: '2001:db8::1',
      ip: '2001:db8::1',
    },
    { name: 'missing Koyeb edge address', isKoyeb: true },
    {
      name: 'invalid Koyeb edge address',
      isKoyeb: true,
      forwardedFor: '192.0.2.10, unknown',
    },
  ];

  for (const { name, isKoyeb, forwardedFor, ip } of cases) {
    await context.test(name, async (testContext) => {
      testContext.mock.property(envConfig, 'isKoyeb', isKoyeb);
      quotaKeys.length = 0;

      for (const { path, method, body, expected } of requests) {
        const headers = new Headers();
        if (body) headers.set('Content-Type', 'application/json');
        if (forwardedFor) {
          headers.set('X-Forwarded-For', forwardedFor);
          headers.set('CF-Connecting-IP', '203.0.113.4');
        }
        const response = await fetch(`${baseURL}${path}`, {
          method,
          headers,
          body,
        });
        assert.equal(response.status, ip ? 200 : 400);
        assert.deepEqual(
          await response.json(),
          ip
            ? expected
            : {
                status: 'error',
                message: 'Client IP address not found or unidentifiable.',
              },
        );
      }

      assert.deepEqual(
        quotaKeys,
        ip ? requests.map(() => `analyzer:remaining:user:${ip}`) : [],
      );
    });
  }
});
