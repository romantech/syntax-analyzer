require('module-alias/register');

const assert = require('node:assert/strict');
const { BlockList } = require('node:net');
const { test } = require('node:test');
const {
  startApp,
  modelAnalysis,
  analysisPromptValues,
} = require('../test-support/app');
const { ANALYZER_REDIS_SCHEMA } = require('../dist/services/redis/redisKeys');

const { KEYS } = ANALYZER_REDIS_SCHEMA;
const analysisTokens = ['I', 'walk.'];
const sentences = ['I walk.'];
const counts = { analysis: 4, random_sentence: 3 };
const quotaKeys = [];
const cloudflarePeers = new BlockList();
cloudflarePeers.addSubnet('198.51.100.0', 24, 'ipv4');
cloudflarePeers.addSubnet('2001:db8:1::', 48, 'ipv6');

test('analyzer endpoints use the same quota IP policy', async (context) => {
  const requests = [
    {
      path: '',
      method: 'POST',
      body: JSON.stringify({ model: 'primary', sentence: analysisTokens }),
      expected: analysisTokens,
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
    {
      name: 'Koyeb edge after a trusted Cloudflare hop',
      isKoyeb: true,
      forwardedFor: '192.0.2.10, 198.51.100.8',
      cloudflarePeers,
      visitorIP: '203.0.113.4',
      ip: '203.0.113.4',
    },
    {
      name: 'Koyeb edge after an IPv6 Cloudflare hop',
      isKoyeb: true,
      forwardedFor: '2001:db8:1::2',
      cloudflarePeers,
      visitorIP: '2001:db8:2::8',
      ip: '2001:db8:2::8',
    },
    {
      name: 'Koyeb edge ignores a Cloudflare header from an untrusted peer',
      isKoyeb: true,
      forwardedFor: '198.51.100.8, 192.0.2.10',
      cloudflarePeers,
      visitorIP: '203.0.113.4',
      ip: '192.0.2.10',
    },
    {
      name: 'Koyeb edge rejects a missing Cloudflare visitor address',
      isKoyeb: true,
      forwardedFor: '198.51.100.8',
      cloudflarePeers,
      visitorIP: '',
    },
    {
      name: 'Koyeb edge rejects an invalid Cloudflare visitor address',
      isKoyeb: true,
      forwardedFor: '198.51.100.8',
      cloudflarePeers,
      visitorIP: '203.0.113.4, 203.0.113.5',
    },
    { name: 'missing Koyeb edge address', isKoyeb: true },
    {
      name: 'invalid Koyeb edge address',
      isKoyeb: true,
      forwardedFor: '192.0.2.10, unknown',
    },
  ];

  for (const {
    name,
    isKoyeb,
    forwardedFor,
    ip,
    cloudflarePeers,
    visitorIP = '203.0.113.4',
  } of cases) {
    await context.test(name, async (testContext) => {
      quotaKeys.length = 0;
      const baseURL = await startApp(testContext, {
        isKoyeb,
        cloudflarePeers,
        redis: {
          hget: async () => 'Follow the instruction.',
          hmget: async () => analysisPromptValues,
          eval: async (_script, keyCount, _totalKey, userKey, ipKey) => {
            assert.equal(ipKey, KEYS.REMAINING.IP(ip));
            quotaKeys.push(userKey);
            return keyCount === 3
              ? [
                  counts.analysis,
                  counts.random_sentence,
                  counts.analysis,
                  counts.random_sentence,
                  counts.analysis,
                  counts.random_sentence,
                ]
              : 1;
          },
        },
        createModel: () => ({
          invoke: async () => modelAnalysis(),
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
          if (visitorIP) headers.set('CF-Connecting-IP', visitorIP);
        }
        const response = await fetch(`${baseURL}/analyzer${path}`, {
          method,
          headers,
          body,
        });
        assert.equal(response.status, ip ? 200 : 400);
        const data = await response.json();
        assert.deepEqual(
          ip && body ? data.sentence : data,
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
