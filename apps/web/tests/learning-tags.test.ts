import assert from 'node:assert/strict';
import { test } from 'node:test';

import { SYNTAX_CONSTITUENTS } from '../src/features/syntax-editor/data/syntax-constituents.ts';
import {
  getLearningSegment,
  getOverviewTag,
} from '../src/features/syntax-editor/helpers/learning-tags.ts';
import type { TSegment } from '../src/features/syntax-editor/types/analysis';

function createAnalysis(sentence: string[], spans: [number, number, ...string[]][]) {
  let id = 0;
  const segment = (
    begin: number,
    end: number,
    labels: string[],
    children: TSegment[] = [],
  ): TSegment => ({
    id: ++id,
    begin,
    end,
    constituents: labels.map((label) => {
      const tag = SYNTAX_CONSTITUENTS.find((entry) => entry.label === label);
      assert.ok(tag, label);
      return { ...tag, id: ++id };
    }),
    children,
  });
  return segment(
    0,
    sentence.length,
    [],
    spans.map(([begin, end, ...labels]) => segment(begin, end, labels)),
  );
}

const labels = (segment: TSegment) => segment.constituents.map(({ label }) => label);

test('기존 분석의 중복 태그를 정리하고 원본 태그를 수정하지 않는다', () => {
  const sentence = ['Mangroves', 'braided', 'the', 'shoreline', '.'];
  const saved = createAnalysis(sentence, [
    [0, 1, 'subject', 'noun phrase'],
    [1, 2, 'verb'],
    [2, 4, 'direct object', 'object', 'noun phrase'],
    [0, 4, 'independent clause'],
  ]);
  const wrapper = saved.children.pop();
  assert.ok(wrapper);
  wrapper.children = saved.children;
  saved.children = [wrapper];
  const before = structuredClone(saved);
  const [projected] = getLearningSegment(saved, sentence).children;
  const main = projected.children;

  assert.deepEqual(labels(projected), []);
  assert.deepEqual(main.map(labels), [['subject'], ['verb'], ['object', 'noun phrase']]);
  assert.equal(getOverviewTag(main[2])?.label, 'object');
  assert.deepEqual(saved, before);
});

test('이중목적어와 목적격 보어의 서로 다른 역할을 유지한다', () => {
  const sentence = ['I', 'gave', 'Mina', 'a', 'book', '.'];
  const saved = createAnalysis(sentence, [
    [2, 3, 'indirect object'],
    [3, 5, 'direct object'],
  ]);
  assert.deepEqual(getLearningSegment(saved, sentence).children.map(labels), [
    ['indirect object'],
    ['direct object'],
  ]);

  const other = ['They', 'made', 'him', 'happy', '.'];
  const made = createAnalysis(other, [
    [2, 3, 'object'],
    [3, 4, 'complement', 'object complement'],
  ]);
  assert.deepEqual(getLearningSegment(made, other).children.map(labels), [
    ['object'],
    ['object complement'],
  ]);
});

test('기본 보기에는 부사어와 장소 보어를 표시하고 형태와 조동사는 상세에 둔다', () => {
  const sentence = ['At', 'dawn', ',', 'she', 'has', 'put', 'it', 'there', '.'];
  const saved = createAnalysis(sentence, [
    [0, 2, 'adverbial', 'prepositional phrase'],
    [4, 5, 'perfect auxiliary'],
    [7, 8, 'adverbial', 'locative complement', 'adverb'],
  ]);
  const projected = getLearningSegment(saved, sentence).children;
  assert.deepEqual(
    projected.map((segment) => getOverviewTag(segment)?.label),
    ['adverbial', undefined, 'locative complement'],
  );
  assert.deepEqual(projected.map(labels), [
    ['adverbial', 'prepositional phrase'],
    ['perfect auxiliary'],
    ['locative complement', 'adverb'],
  ]);
});

test('역할이 확인되는 옛 부사구를 기본 보기에 표시하고 전치사구의 역할을 추측하지 않는다', () => {
  const sentence = ['She', 'arrived', 'very', 'early', 'in', 'spring', '.'];
  const saved = createAnalysis(sentence, [
    [2, 4, 'adverbial phrase'],
    [4, 6, 'prepositional phrase'],
  ]);
  const [modifier, phrase] = getLearningSegment(saved, sentence).children;
  assert.deepEqual(labels(modifier), ['adverbial', 'adverbial phrase']);
  assert.notEqual(modifier.constituents[0].id, modifier.constituents[1].id);
  assert.equal(getOverviewTag(phrase), undefined);
  assert.deepEqual(labels(phrase), ['prepositional phrase']);
});

test('저장된 동사구 안의 절 수식어를 기본 보기 부사어로 표시한다', () => {
  const sentence = ['She', 'arrived', 'early', '.'];
  const saved = createAnalysis(sentence, [
    [0, 1, 'subject'],
    [1, 3, 'verb phrase'],
    [1, 2, 'verb'],
    [2, 3, 'adverb'],
  ]);
  const [subject, phrase, verb, adverb] = saved.children;
  saved.children = [subject, phrase];
  phrase.children = [verb, adverb];

  const shown = getLearningSegment(saved, sentence).children[1].children[1];
  assert.equal(getOverviewTag(shown)?.label, 'adverbial');
  assert.deepEqual(labels(shown), ['adverbial', 'adverb']);
  assert.deepEqual(labels(adverb), ['adverb']);
});

test('명사구와 형용사구 안의 부사는 절 수식어로 올리지 않는다', () => {
  const sentence = ['She', 'found', 'a', 'very', 'quiet', 'room', '.'];
  const wrappers: [number, number, string][] = [
    [2, 6, 'noun phrase'],
    [3, 5, 'adjectival phrase'],
  ];
  for (const wrapper of wrappers) {
    const saved = createAnalysis(sentence, [[1, 6, 'verb phrase'], wrapper, [3, 4, 'adverb']]);
    const [verbPhrase, innerPhrase, adverb] = saved.children;
    saved.children = [verbPhrase];
    verbPhrase.children = [innerPhrase];
    innerPhrase.children = [adverb];

    const shown = getLearningSegment(saved, sentence).children[0].children[0].children[0];
    assert.equal(getOverviewTag(shown), undefined, wrapper[2]);
    assert.deepEqual(labels(shown), ['adverb']);
  }
});
