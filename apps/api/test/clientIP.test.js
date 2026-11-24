require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { startApp } = require('../test-support/app');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');

const { KEYS } = ANALYZER_REDIS_SCHEMA;
const analysis = { id: 'analysis-result' };
const sentences = ['I walk.'];
const counts = { analysis: 4, random_sentence: 3 };
const quotaKeys = [];

test('analyzer endpoints use the same quota IP policy', async (context) => {
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
      quotaKeys.length = 0;
      const baseURL = await startApp(testContext, {
        isKoyeb,
        redis: {
          hget: async () => 'Follow the instruction.',
          eval: async (_script, keyCount, _totalKey, userKey) => {
            quotaKeys.push(userKey);
            return keyCount === 2
              ? [
                  counts.analysis,
                  counts.random_sentence,
                  counts.analysis,
                  counts.random_sentence,
                ]
              : 1;
          },
        },
        createModel: () => ({
          pipe: () => ({ invoke: async () => JSON.stringify(analysis) }),
          withStructuredOutput: () => ({
            invoke: async () => ({ sentences }),
          }),
        }),
      });

      for (const { path, method, body, expected } of requests) {
        const headers = new Headers();
        if (body) headers.set('Content-Type', 'application/json');
        if (forwardedFor) {
          headers.set('X-Forwarded-For', forwardedFor);
          headers.set('CF-Connecting-IP', '203.0.113.4');
        }
        const response = await fetch(`${baseURL}/analyzer${path}`, {
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
        ip ? requests.map(() => KEYS.REMAINING.USER(ip)) : [],
      );
    });
  }
});
