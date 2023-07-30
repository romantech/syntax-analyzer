import {
  Constituent,
  ConstituentType,
  ConstituentWithoutId,
} from '@/types/analysis';

export const CONSTITUENT_DATA_ATTRS = {
  TOKEN_INDEX: 'data-token-index',
  CONSTITUENT_ABBR: 'data-constituent-abbr',
  CONSTITUENT_LABEL: 'data-constituent-label',
  CONSTITUENT_ID: 'data-constituent-id',
} as const;

export const CONSTITUENT_CLASSES = {
  CONSTITUENT: 'constituent',
  TOKEN_GROUP: 'token-group',
  CLAUSE: 'clause',
  PHRASE: 'phrase',
  TOKEN: 'token',
} as const;

export const CONSTITUENTS: ConstituentWithoutId[] = [
  { elementId: 1, label: 'subject', abbreviation: 's', type: 'token' },
  { elementId: 2, label: 'verb', abbreviation: 'v', type: 'token' },
  {
    elementId: 3,
    label: 'auxiliary verb',
    abbreviation: 'aux.v',
    type: 'token',
  },
  {
    elementId: 4,
    label: 'modal verb',
    abbreviation: 'mod.v',
    type: 'token',
  },
  { elementId: 5, label: 'object', abbreviation: 'o', type: 'token' },
  {
    elementId: 6,
    label: 'indirect object',
    abbreviation: 'i.o.',
    type: 'token',
  },
  {
    elementId: 7,
    label: 'direct object',
    abbreviation: 'd.o.',
    type: 'token',
  },
  {
    elementId: 8,
    label: 'prepositional object',
    abbreviation: 'prp.o.',
    type: 'token',
  },
  { elementId: 9, label: 'complement', abbreviation: 'c', type: 'token' },
  {
    elementId: 10,
    label: 'object complement',
    abbreviation: 'o.c.',
    type: 'token',
  },
  {
    elementId: 11,
    label: 'to-infinitive',
    abbreviation: 't-inf',
    type: 'token',
  },
  {
    elementId: 12,
    label: 'infinitive object',
    abbreviation: 'inf.o.',
    type: 'token',
  },
  { elementId: 13, label: 'gerund', abbreviation: 'g', type: 'token' },
  {
    elementId: 14,
    label: 'gerund object',
    abbreviation: 'g.o.',
    type: 'phrase',
  },
  { elementId: 15, label: 'participle', abbreviation: 'pt', type: 'token' },
  {
    elementId: 16,
    label: 'participle object',
    abbreviation: 'pt.o.',
    type: 'phrase',
  },
  {
    elementId: 17,
    label: 'participle phrase',
    abbreviation: 'pt.phr',
    type: 'phrase',
  },
  {
    elementId: 18,
    label: 'prepositional phrase',
    abbreviation: 'prp.phr',
    type: 'phrase',
  },
  {
    elementId: 19,
    label: 'adverbial phrase',
    abbreviation: 'adv.phr',
    type: 'phrase',
  },
  {
    elementId: 20,
    label: 'adjectival phrase',
    abbreviation: 'adj.phr',
    type: 'phrase',
  },
  {
    elementId: 21,
    label: 'coordinating conjunction',
    abbreviation: 'co.t',
    type: 'phrase',
  },
  {
    elementId: 22,
    label: 'coordinating clause',
    abbreviation: 'co.cl',
    type: 'clause',
  },
  {
    elementId: 23,
    label: 'parallel clause',
    abbreviation: 'p.cl',
    type: 'clause',
  },
  {
    elementId: 24,
    label: 'noun clause',
    abbreviation: 'n.cl',
    type: 'clause',
  },
  {
    elementId: 25,
    label: 'adjectival clause',
    abbreviation: 'adj.cl',
    type: 'clause',
  },
  {
    elementId: 26,
    label: 'adverbial clause',
    abbreviation: 'adv.cl',
    type: 'clause',
  },
  {
    elementId: 27,
    label: 'inserted clause',
    abbreviation: 'i.cl',
    type: 'clause',
  },
  {
    elementId: 28,
    label: 'relative clause',
    abbreviation: 'rel.cl',
    type: 'clause',
  },
  {
    elementId: 29,
    label: 'dependent clause',
    abbreviation: 'dep.cl',
    type: 'clause',
  },
  {
    elementId: 30,
    label: 'independent clause',
    abbreviation: 'ind.cl',
    type: 'clause',
  },
];

type EnglishLabels = Extract<Constituent, { label: string }>['label'];

export const CONSTITUENT_TRANSLATIONS: Record<
  EnglishLabels,
  { ko: string; desc: string }
> = {
  subject: {
    ko: '주어',
    desc: '문장에서 동작이나 상태의 주체를 나타내는 단어나 구',
  },
  verb: {
    ko: '동사',
    desc: '문장에서 동작, 상태, 또는 사건을 표현하는 단어',
  },
  'auxiliary verb': {
    ko: '조동사',
    desc: '다른 동사와 함께 사용되어 동작, 상태, 관계를 나타내는 동사',
  },
  'modal verb': {
    ko: '법조동사',
    desc: '가능성, 허락, 의무 등을 나타내는 동사',
  },
  object: {
    ko: '목적어',
    desc: '동사의 동작이나 상태에 영향을 받는 단어나 구',
  },
  'indirect object': {
    ko: '간접 목적어',
    desc: '동사의 동작이 미치는 대상을 나타내는 단어나 구',
  },
  'direct object': {
    ko: '직접 목적어',
    desc: '동사의 동작이 직접적으로 영향을 주는 단어나 구',
  },
  'prepositional object': {
    ko: '전치사 목적어',
    desc: '전치사에 의해 소개되는 단어나 구',
  },
  complement: {
    ko: '보어',
    desc: '주어나 목적어를 설명하거나 보완하는 단어나 구',
  },
  'object complement': {
    ko: '목적보어',
    desc: '목적어를 설명하거나 보완하는 단어나 구',
  },
  'to-infinitive': {
    ko: 'to부정사',
    desc: "'to'와 함께 사용되는 동사의 기본형",
  },
  'infinitive object': {
    ko: '부정사 목적어',
    desc: '부정사 동사의 동작이나 상태에 영향을 받는 단어나 구',
  },
  gerund: {
    ko: '동명사',
    desc: '동사에 -ing 형태를 더해 명사로 사용하는 형태',
  },
  'gerund object': {
    ko: '동명사 목적어',
    desc: '동명사의 동작이나 상태에 영향을 받는 단어나 구',
  },
  participle: { ko: '분사', desc: '동사의 과거 분사나 현재 분사 형태' },
  'participle object': {
    ko: '분사 목적어',
    desc: '분사 동작의 대상이 되는 단어나 구',
  },
  'participle phrase': {
    ko: '분사 구문',
    desc: '분사와 그 관련 구성요소로 이루어진 구문',
  },
  'prepositional phrase': {
    ko: '전치사구',
    desc: '전치사와 그 객체로 이루어진 구문',
  },
  'adverbial phrase': {
    ko: '부사구',
    desc: '문장 내에서 부사의 역할을 하는 구문',
  },
  'adjectival phrase': {
    ko: '형용사구',
    desc: '문장 내에서 형용사의 역할을 하는 구문',
  },
  'coordinating conjunction': {
    ko: '등위 접속사',
    desc: '동일한 문법적 가치를 가진 구나 절을 연결하는 접속사',
  },
  'coordinating clause': {
    ko: '등위절',
    desc: '동등한 문법적 가치를 가진 두 개 이상의 절',
  },
  'parallel clause': {
    ko: '병렬절',
    desc: '동일한 문법 구조를 갖는 두 개 이상의 절',
  },
  'noun clause': { ko: '명사절', desc: '문장에서 명사 역할을 하는 절' },
  'adjectival clause': {
    ko: '형용사절',
    desc: '문장에서 형용사 역할을 하는 절',
  },
  'adverbial clause': {
    ko: '부사절',
    desc: '문장에서 부사 역할을 하는 절',
  },
  'inserted clause': { ko: '삽입절', desc: '다른 절 속에 삽입된 절' },
  'relative clause': {
    ko: '관계절',
    desc: '주절에 관계된 세부 정보를 제공하는 절',
  },
  'dependent clause': {
    ko: '종속절',
    desc: '다른 절에 의존하여 완전한 의미를 가질 수 없는 절',
  },
  'independent clause': {
    ko: '독립절',
    desc: '다른 절에 의존하지 않고 독립적으로 완전한 의미를 가진 절',
  },
};

type ConstituentGroup = { [key in ConstituentType]: ConstituentWithoutId[] };
const groupedConstituentsByType = CONSTITUENTS.reduce((group, constituent) => {
  if (!group[constituent.type]) group[constituent.type] = [];
  group[constituent.type].push(constituent);
  return group;
}, {} as ConstituentGroup);

export const CONSTITUENT_CATEGORIES = [
  {
    label: 'general',
    desc: '주어/동사 등 태그',
    constituents: groupedConstituentsByType.token,
  },
  {
    label: 'phrase',
    desc: '전치사구/동명사구 등 태그',
    constituents: groupedConstituentsByType.phrase,
  },
  {
    label: 'clause',
    desc: '독립절/의존절 등 태그',
    constituents: groupedConstituentsByType.clause,
  },
];
