import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createServer } from 'vite';

import { RELATIVE_CLAUSE_SAMPLE } from '../src/features/syntax-editor/data/sample-analysis.ts';

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

  const remaining = async () => (await fetch(`${base}api/analyzer/remaining-counts`)).json();
  const before = await remaining();
  const invalid = await fetch(`${base}api/analyzer/random-sentences?sent_count=6`);
  assert.equal(invalid.status, 400);
  assert.deepEqual(await remaining(), before);

  const random = await fetch(`${base}api/analyzer/random-sentences?sent_count=4&topics=travel`);
  assert.equal(random.status, 200);
  const sentences = await random.json();
  assert.equal(sentences.length, 4);
  assert.equal(sentences[0], 'The idea that she proposed was innovative.');

  const analyze = async (sentence: string[]) => {
    const response = await fetch(`${base}api/analyzer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'primary', sentence }),
    });
    assert.equal(response.status, 200);
    return response.json();
  };

  const sample = await analyze(RELATIVE_CLAUSE_SAMPLE.sentence);
  assert.deepEqual(sample.sentence, RELATIVE_CLAUSE_SAMPLE.sentence);
  assert.deepEqual(sample.rootSegment, RELATIVE_CLAUSE_SAMPLE.rootSegment);
  assert.equal(sample.source, 'user');
  assert.equal(sample.isAnalyzedByGPT, true);

  const sentence = ['The', 'idea', 'that', 'she', 'proposed', 'was', 'bold', '.'];
  const analysis = await analyze(sentence);
  assert.deepEqual(analysis.sentence, sentence);
  assert.equal(analysis.source, 'user');
  assert.equal(analysis.rootSegment.begin, 0);
  assert.equal(analysis.rootSegment.end, sentence.length);
  assert.deepEqual(analysis.rootSegment.constituents, []);
  assert.deepEqual(analysis.rootSegment.children, []);
  assert.deepEqual(await remaining(), {
    analysis: before.analysis - 4,
    random_sentence: before.random_sentence - 1,
  });
});
