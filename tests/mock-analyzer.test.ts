import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createServer } from 'vite';

test('목 API는 요청한 문장과 분석 토큰을 반환하고 성공한 요청만 차감한다', async (t) => {
  const scenario = process.env.MOCK_API_SCENARIO;
  delete process.env.MOCK_API_SCENARIO;
  t.after(() => {
    if (scenario !== undefined) process.env.MOCK_API_SCENARIO = scenario;
  });

  const cacheDir = await mkdtemp(join(tmpdir(), 'syntax-analyzer-test-'));
  t.after(() => rm(cacheDir, { recursive: true, force: true }));
  const server = await createServer({
    cacheDir,
    mode: 'mock',
    optimizeDeps: { noDiscovery: true },
    server: { host: '127.0.0.1', port: 0, open: false, watch: null, ws: false },
  });
  t.after(() => server.close());
  await server.listen();
  const base = server.resolvedUrls?.local[0];
  assert.ok(base);

  const remaining = async () => (await fetch(`${base}analyzer/remaining-counts`)).json();
  const before = await remaining();
  const invalid = await fetch(`${base}analyzer/random-sentences?sent_count=6`);
  assert.equal(invalid.status, 400);
  assert.deepEqual(await remaining(), before);

  const random = await fetch(`${base}analyzer/random-sentences?sent_count=4&topics=travel`);
  assert.equal(random.status, 200);
  assert.equal((await random.json()).length, 4);

  const sentence = ['I', 'will', 'read', '.'];
  const analyzed = await fetch(`${base}analyzer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'primary', sentence }),
  });
  assert.equal(analyzed.status, 200);
  const analysis = await analyzed.json();
  assert.deepEqual(analysis.sentence, sentence);
  assert.equal(analysis.source, 'user');
  assert.equal(analysis.rootSegment.begin, 0);
  assert.equal(analysis.rootSegment.end, sentence.length);
  assert.deepEqual(await remaining(), {
    analysis: before.analysis - 2,
    random_sentence: before.random_sentence - 1,
  });
});
