import assert from 'node:assert/strict';
import { test } from 'node:test';

import { SYNTAX_CONSTITUENTS } from '../src/features/syntax-editor/data/syntax-constituents.ts';
import {
  getLearningSegment,
  getOverviewTag,
} from '../src/features/syntax-editor/helpers/learning-tags.ts';
import { getOverviewDetails } from '../src/features/syntax-editor/helpers/overview-details.ts';
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

test('명사절을 이끄는 that의 접속사 태그를 기본 보기에 표시한다', () => {
  const sentence = ['She', 'said', 'that', 'he', 'left', '.'];
  for (const clauseLabels of [['noun clause'], ['object', 'noun clause']]) {
    for (const connectorLabels of [[], ['conjunction']]) {
      const saved = createAnalysis(sentence, [
        [0, 1, 'subject'],
        [1, 2, 'verb'],
        [2, 5, ...clauseLabels],
        [2, 3, ...connectorLabels],
        [3, 4, 'subject'],
        [4, 5, 'verb'],
      ]);
      const [subject, verb, clause, connector, embeddedSubject, embeddedVerb] = saved.children;
      saved.children = [subject, verb, clause];
      clause.children = [connector, embeddedSubject, embeddedVerb];
      const before = structuredClone(saved);

      const learning = getLearningSegment(saved, sentence);
      const collapsed = getOverviewDetails(learning, new Set());
      assert.deepEqual(
        collapsed.get(connector.id)?.tags.map(({ label }) => label),
        ['conjunction'],
      );
      if (clauseLabels.includes('object')) {
        assert.equal(collapsed.has(embeddedSubject.id), false);
        const opened = getOverviewDetails(learning, new Set([clause.id]));
        assert.equal(opened.get(embeddedSubject.id)?.tags[0]?.label, 'subject');
        assert.equal(opened.get(connector.id)?.tags.length, 1);
      }
      assert.deepEqual(saved, before);
    }
  }
});

test('명사절 주어에 속한 지시사 that에 접속사 태그를 추가하지 않는다', () => {
  const sentence = ['She', 'knows', 'that', 'book', 'is', 'popular', '.'];
  const saved = createAnalysis(sentence, [
    [2, 6, 'object', 'noun clause'],
    [2, 4, 'subject', 'noun phrase'],
    [2, 3],
    [3, 4],
    [4, 5, 'verb'],
  ]);
  const [clause, subject, demonstrative, noun, verb] = saved.children;
  saved.children = [clause];
  clause.children = [subject, verb];
  subject.children = [demonstrative, noun];

  const learning = getLearningSegment(saved, sentence);
  const projectedSubject = learning.children[0].children[0];
  assert.deepEqual(labels(projectedSubject.children[0]), []);
});

test('개별 태그를 펼치면 같은 범위와 상위 구·절의 태그를 표시한다', () => {
  const sentence = ['The', 'child', 'opened', 'it', ',', 'and', 'she', 'left', '.'];
  const saved = createAnalysis(sentence, [
    [0, 4, 'independent clause'],
    [0, 2, 'subject', 'noun phrase'],
    [2, 4, 'verb phrase'],
    [2, 3, 'verb'],
    [3, 4, 'object'],
    [6, 8, 'independent clause'],
    [6, 7, 'subject'],
  ]);
  const [clause, subject, phrase, verb, object, otherClause, otherSubject] = saved.children;
  saved.children = [clause, otherClause];
  clause.children = [subject, phrase];
  phrase.children = [verb, object];
  otherClause.children = [otherSubject];

  const learning = getLearningSegment(saved, sentence);
  const overview = (...ids: number[]) => getOverviewDetails(learning, new Set(ids));
  const visibleLabels = (details: ReturnType<typeof overview>, segment: TSegment) =>
    details.get(segment.id)?.tags.map(({ label }) => label);

  const collapsed = overview();
  assert.equal(collapsed.get(verb.id)?.canExpand, true);
  assert.equal(collapsed.get(object.id)?.canExpand, false);
  assert.deepEqual(visibleLabels(collapsed, clause), []);

  const subjectOpen = overview(subject.id);
  assert.deepEqual(visibleLabels(subjectOpen, subject), ['subject', 'noun phrase']);
  assert.deepEqual(visibleLabels(subjectOpen, clause), ['independent clause']);
  assert.deepEqual(visibleLabels(subjectOpen, phrase), []);

  const bothOpen = overview(subject.id, verb.id);
  assert.deepEqual(visibleLabels(bothOpen, phrase), ['verb phrase']);
  assert.deepEqual(visibleLabels(bothOpen, otherClause), []);

  const verbOpen = overview(verb.id);
  assert.deepEqual(visibleLabels(verbOpen, subject), ['subject']);
  assert.deepEqual(visibleLabels(verbOpen, clause), ['independent clause']);
  assert.deepEqual(visibleLabels(verbOpen, phrase), ['verb phrase']);
  assert.equal(overview().get(otherSubject.id)?.canExpand, true);
  assert.deepEqual(visibleLabels(overview(), phrase), []);
});

test('같은 명사절만 여는 버튼은 접속사에 두고 고유한 상세 버튼은 유지한다', () => {
  const sentence = ['She', 'said', 'that', 'he', 'had', 'left', '.'];
  const saved = createAnalysis(sentence, [
    [2, 6, 'noun clause'],
    [2, 3, 'conjunction'],
    [3, 4, 'subject'],
    [4, 6, 'verb'],
    [4, 5, 'perfect auxiliary'],
    [5, 6, 'verb'],
  ]);
  const [clause, introducer, subject, verb, auxiliary, lexicalVerb] = saved.children;
  saved.children = [clause];
  clause.children = [introducer, subject, verb];
  verb.children = [auxiliary, lexicalVerb];

  const learning = getLearningSegment(saved, sentence);
  const overview = (...ids: number[]) => getOverviewDetails(learning, new Set(ids));
  const collapsed = overview();
  assert.equal(collapsed.get(introducer.id)?.canExpand, true);
  assert.equal(collapsed.get(subject.id)?.canExpand, false);
  assert.equal(collapsed.get(verb.id)?.canExpand, true);
  assert.deepEqual(overview(subject.id).get(clause.id)?.tags, []);

  const opened = overview(introducer.id);
  assert.deepEqual(
    opened.get(clause.id)?.tags.map(({ label }) => label),
    ['noun clause'],
  );
  assert.equal(opened.has(lexicalVerb.id), false);
  const verbOpen = overview(verb.id);
  assert.equal(verbOpen.get(introducer.id)?.canExpand, false);
  assert.equal(verbOpen.get(subject.id)?.canExpand, false);
  assert.equal(verbOpen.get(lexicalVerb.id)?.role?.label, 'verb');
});

test('공유 등위절이 보이면 현재 태그를 바꾸는 버튼만 표시한다', () => {
  const sentence = 'Our town has banned lawn watering , so the grass looks brown .'.split(' ');
  const saved = createAnalysis(sentence, [
    [0, 6, 'coordinating clause'],
    [0, 2, 'subject'],
    [2, 4, 'verb'],
    [2, 3, 'perfect auxiliary'],
    [3, 4, 'verb'],
    [4, 6, 'object', 'noun phrase'],
  ]);
  const [clause, subject, verb, auxiliary, lexicalVerb, object] = saved.children;
  saved.children = [clause];
  clause.children = [subject, verb, object];
  verb.children = [auxiliary, lexicalVerb];

  const learning = getLearningSegment(saved, sentence);
  const overview = (...ids: number[]) => getOverviewDetails(learning, new Set(ids));
  const collapsed = overview();
  assert.equal(collapsed.get(subject.id)?.canExpand, true);
  assert.deepEqual(collapsed.get(clause.id)?.tags, []);

  for (const first of [verb, object]) {
    const second = first === verb ? object : verb;
    const opened = overview(first.id);
    assert.equal(opened.get(clause.id)?.tags[0]?.label, 'coordinating clause');
    assert.equal(opened.get(subject.id)?.canExpand, false);
    assert.equal(opened.get(second.id)?.canExpand, true);

    const bothOpen = overview(first.id, second.id);
    assert.equal(bothOpen.get(first.id)?.canExpand, true);
    assert.equal(bothOpen.get(second.id)?.canExpand, true);
  }

  const subjectAndVerbOpen = overview(subject.id, verb.id);
  assert.equal(subjectAndVerbOpen.get(subject.id)?.canExpand, false);
  assert.equal(subjectAndVerbOpen.get(verb.id)?.canExpand, true);
  const subjectOpen = overview(subject.id);
  assert.equal(subjectOpen.get(subject.id)?.canExpand, true);
  assert.equal(subjectOpen.get(subject.id)?.expanded, true);
  assert.equal(subjectOpen.get(clause.id)?.tags.length, 1);

  const all = getOverviewDetails(learning, new Set(), true);
  assert.equal(all.get(verb.id)?.expanded, true);
  assert.equal(all.get(object.id)?.expanded, true);
  assert.equal(all.get(subject.id)?.canExpand, false);

  const verbClosed = getOverviewDetails(learning, new Set([verb.id]), true);
  assert.equal(verbClosed.has(lexicalVerb.id), false);
  assert.equal(verbClosed.get(auxiliary.id)?.tags[0]?.label, 'perfect auxiliary');
  assert.equal(verbClosed.get(object.id)?.tags[1]?.label, 'noun phrase');
  assert.equal(verbClosed.get(clause.id)?.tags[0]?.label, 'coordinating clause');

  const subjectOnly = getOverviewDetails(learning, new Set([verb.id, object.id]), true);
  assert.equal(subjectOnly.get(subject.id)?.canExpand, true);
  const allClosed = getOverviewDetails(learning, new Set([verb.id, object.id, subject.id]), true);
  assert.deepEqual(allClosed.get(clause.id)?.tags, []);
});

test('접속사가 생략된 명사절의 공통 버튼은 첫 라벨에 표시한다', () => {
  const sentence = ['I', 'know', 'he', 'left', '.'];
  const saved = createAnalysis(sentence, [
    [2, 4, 'noun clause'],
    [2, 3, 'subject'],
    [3, 4, 'verb'],
  ]);
  const [clause, subject, verb] = saved.children;
  saved.children = [clause];
  clause.children = [subject, verb];

  const learning = getLearningSegment(saved, sentence);
  const collapsed = getOverviewDetails(learning, new Set());
  assert.equal(collapsed.get(subject.id)?.canExpand, true);
  assert.equal(collapsed.get(verb.id)?.canExpand, false);
});

test('이미 보이는 조동사만 들어 있는 동사에는 펼침 버튼을 표시하지 않는다', () => {
  const sentence = ['She', 'will', 'go', '.'];
  const saved = createAnalysis(sentence, [
    [1, 3, 'verb'],
    [1, 2, 'modal verb'],
  ]);
  const [verb, auxiliary] = saved.children;
  saved.children = [verb];
  verb.children = [auxiliary];

  const learning = getLearningSegment(saved, sentence);
  const collapsed = getOverviewDetails(learning, new Set());
  assert.equal(collapsed.get(verb.id)?.canExpand, false);
  assert.equal(collapsed.get(auxiliary.id)?.role?.label, 'modal verb');
});

test('접힌 상위 태그 아래의 펼침 상태로 구·절이 드러나지 않는다', () => {
  const sentence = ['We', 'saw', 'what', 'the', 'child', 'wrote', '.'];
  const saved = createAnalysis(sentence, [
    [1, 6, 'verb phrase'],
    [2, 6, 'object', 'noun clause'],
    [3, 5, 'subject', 'noun phrase'],
    [5, 6, 'verb'],
  ]);
  const [phrase, object, subject, verb] = saved.children;
  saved.children = [phrase];
  phrase.children = [object];
  object.children = [subject, verb];

  const learning = getLearningSegment(saved, sentence);
  const open = getOverviewDetails(learning, new Set([object.id, subject.id]));
  assert.equal(open.get(subject.id)?.expanded, true);
  assert.equal(open.get(verb.id)?.canExpand, false);
  assert.deepEqual(
    open.get(phrase.id)?.tags.map(({ label }) => label),
    ['verb phrase'],
  );

  const closed = getOverviewDetails(learning, new Set([subject.id]));
  assert.equal(closed.has(subject.id), false);
  assert.deepEqual(closed.get(phrase.id)?.tags, []);
});

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

test('기본 보기에는 부사어와 장소 보어를 표시하고 형태 태그는 상세에 둔다', () => {
  const sentence = ['At', 'dawn', ',', 'she', 'put', 'it', 'there', '.'];
  const saved = createAnalysis(sentence, [
    [0, 2, 'adverbial', 'prepositional phrase'],
    [6, 7, 'adverbial', 'locative complement', 'adverb'],
  ]);
  const projected = getLearningSegment(saved, sentence).children;
  assert.deepEqual(
    projected.map((segment) => getOverviewTag(segment)?.label),
    ['adverbial', 'locative complement'],
  );
  assert.deepEqual(projected.map(labels), [
    ['adverbial', 'prepositional phrase'],
    ['locative complement', 'adverb'],
  ]);
});

test('기본 보기에서 독립된 조동사 태그를 표시한다', () => {
  const examples: [string[], number, string][] = [
    [
      ['Did', 'Maya', 'leave', 'her', 'sketchbook', 'beside', 'the', 'window', '?'],
      0,
      'do-support auxiliary',
    ],
    [['She', 'has', 'left', '.'], 1, 'perfect auxiliary'],
    [['She', 'is', 'leaving', '.'], 1, 'progressive auxiliary'],
    [['She', 'was', 'invited', '.'], 1, 'passive auxiliary'],
  ];

  for (const [sentence, index, label] of examples) {
    const saved = createAnalysis(sentence, [[index, index + 1, label]]);
    const [auxiliary] = getLearningSegment(saved, sentence).children;

    assert.equal(getOverviewTag(auxiliary)?.label, label, sentence.join(' '));
  }
});

test('동사 전체 범위 아래의 조동사를 접힌 상태에서 표시한다', () => {
  const sentence = ['She', 'has', 'been', 'studying', '.'];
  const saved = createAnalysis(sentence, [
    [0, 1, 'subject'],
    [1, 4, 'verb'],
    [1, 2, 'perfect auxiliary'],
    [2, 3, 'progressive auxiliary'],
    [3, 4, 'participle'],
  ]);
  const [subject, verb, perfect, progressive, participle] = saved.children;
  saved.children = [subject, verb];
  verb.children = [perfect, progressive, participle];

  const learning = getLearningSegment(saved, sentence);
  const collapsed = getOverviewDetails(learning, new Set());
  assert.equal(collapsed.get(verb.id)?.role?.label, 'verb');
  assert.equal(collapsed.get(perfect.id)?.role?.label, 'perfect auxiliary');
  assert.equal(collapsed.get(progressive.id)?.role?.label, 'progressive auxiliary');
  assert.equal(collapsed.has(participle.id), false);
  const opened = getOverviewDetails(learning, new Set([verb.id]));
  assert.equal(opened.get(participle.id)?.tags[0]?.label, 'participle');
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

test('절 수준의 전치사구는 기본 보기에 표시하고 전치사 목적어는 펼치면 표시한다', () => {
  const sentence = ['She', 'said', 'to', 'staff', 'during', 'a', 'meeting', '.'];
  const saved = createAnalysis(sentence, [
    [1, 7, 'verb phrase'],
    [1, 2, 'verb'],
    [2, 4, 'prepositional phrase'],
    [3, 4, 'prepositional object'],
    [4, 7, 'adverbial', 'prepositional phrase'],
  ]);
  const [verbPhrase, verb, recipient, staff, time] = saved.children;
  saved.children = [verbPhrase];
  verbPhrase.children = [verb, recipient, time];
  recipient.children = [staff];

  const learning = getLearningSegment(saved, sentence);
  const collapsed = getOverviewDetails(learning, new Set());
  assert.equal(collapsed.get(recipient.id)?.role?.label, 'prepositional phrase');
  assert.equal(collapsed.get(recipient.id)?.canExpand, true);
  assert.equal(collapsed.has(staff.id), false);
  assert.equal(collapsed.get(time.id)?.role?.label, 'adverbial');

  const opened = getOverviewDetails(learning, new Set([recipient.id]));
  assert.equal(opened.get(staff.id)?.tags[0]?.label, 'prepositional object');
  assert.deepEqual(labels(recipient), ['prepositional phrase']);
});

test('명사에 붙은 전치사구는 기본 보기에서 숨긴다', () => {
  const sentence = ['She', 'read', 'the', 'letter', 'to', 'staff', '.'];
  const saved = createAnalysis(sentence, [
    [2, 6, 'object', 'noun phrase'],
    [4, 6, 'prepositional phrase'],
  ]);
  const [object, recipient] = saved.children;
  saved.children = [object];
  object.children = [recipient];

  const learning = getLearningSegment(saved, sentence);
  assert.equal(getOverviewDetails(learning, new Set()).has(recipient.id), false);
  const opened = getOverviewDetails(learning, new Set([object.id]));
  assert.equal(opened.get(recipient.id)?.tags[0]?.label, 'prepositional phrase');

  object.constituents = object.constituents.filter(({ label }) => label === 'noun phrase');
  const withoutRole = getLearningSegment(saved, sentence);
  assert.deepEqual(getOverviewDetails(withoutRole, new Set()).get(recipient.id)?.tags, []);
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

test('저장된 수동절의 by 전치사구를 기본 보기 부사어로 표시한다', () => {
  const sentence = [
    'Before',
    'dawn',
    ',',
    'the',
    'lanterns',
    'were',
    'dimmed',
    'by',
    'the',
    'caretaker',
    '.',
  ];
  const saved = createAnalysis(sentence, [
    [5, 7, 'verb'],
    [5, 6, 'passive auxiliary'],
    [7, 10, 'prepositional phrase'],
  ]);
  const [verb, auxiliary, phrase] = saved.children;
  saved.children = [verb, phrase];
  verb.children = [auxiliary];

  const shown = getLearningSegment(saved, sentence).children[1];
  assert.equal(getOverviewTag(shown)?.label, 'adverbial');
  assert.deepEqual(labels(shown), ['adverbial', 'prepositional phrase']);
  assert.deepEqual(labels(phrase), ['prepositional phrase']);

  verb.children = [];
  const active = getLearningSegment(saved, sentence).children[1];
  assert.equal(getOverviewTag(active), undefined);
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
