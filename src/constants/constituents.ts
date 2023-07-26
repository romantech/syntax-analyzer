import { Constituent, ConstituentType } from '@/types/analysis';
import { ConstituentColors } from '@/types/common';

export const CONSTITUENT_COLORS: ConstituentColors = {
  token: {
    dark: 'red.200',
    light: 'red.400',
  },
  phrase: {
    dark: 'purple.200',
    light: 'purple.400',
  },
  clause: {
    dark: 'teal.200',
    light: 'teal.400',
  },
};

export const CONSTITUENTS: Omit<Constituent, 'id'>[] = [
  { label: 'subject', abbreviation: 's', type: 'token' },
  { label: 'verb', abbreviation: 'v', type: 'token' },
  { label: 'auxiliary verb', abbreviation: 'aux.v', type: 'token' },
  { label: 'modal verb', abbreviation: 'mod.v', type: 'token' },
  { label: 'object', abbreviation: 'o', type: 'token' },
  { label: 'indirect object', abbreviation: 'i.o.', type: 'token' },
  { label: 'direct object', abbreviation: 'd.o.', type: 'token' },
  { label: 'prepositional object', abbreviation: 'prp.o.', type: 'token' },
  { label: 'complement', abbreviation: 'c', type: 'token' },
  { label: 'object complement', abbreviation: 'o.c.', type: 'token' },
  { label: 'to-infinitive', abbreviation: 't-inf', type: 'token' },
  { label: 'infinitive object', abbreviation: 'inf.o.', type: 'token' },
  { label: 'gerund', abbreviation: 'g', type: 'token' },
  { label: 'gerund object', abbreviation: 'g.o.', type: 'phrase' },
  { label: 'participle', abbreviation: 'pt', type: 'token' },
  { label: 'participle object', abbreviation: 'pt.o.', type: 'phrase' },
  { label: 'participle phrase', abbreviation: 'pt.phr', type: 'phrase' },
  { label: 'prepositional phrase', abbreviation: 'prp.phr', type: 'phrase' },
  { label: 'adverbial phrase', abbreviation: 'adv.phr', type: 'phrase' },
  { label: 'adjectival phrase', abbreviation: 'adj.phr', type: 'phrase' },
  { label: 'coordinating conjunction', abbreviation: 'co.t', type: 'phrase' },
  { label: 'coordinating clause', abbreviation: 'co.cl', type: 'clause' },
  { label: 'parallel clause', abbreviation: 'p.cl', type: 'clause' },
  { label: 'noun clause', abbreviation: 'n.cl', type: 'clause' },
  { label: 'adjectival clause', abbreviation: 'adj.cl', type: 'clause' },
  { label: 'adverbial clause', abbreviation: 'adv.cl', type: 'clause' },
  { label: 'inserted clause', abbreviation: 'i.cl', type: 'clause' },
  { label: 'relative clause', abbreviation: 'rel.cl', type: 'clause' },
  { label: 'dependent clause', abbreviation: 'dep.cl', type: 'clause' },
  { label: 'independent clause', abbreviation: 'ind.cl', type: 'clause' },
];

type EnglishLabels = Extract<Constituent, { label: string }>['label'];

export const ConstituentTranslations: Record<
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

type ConstituentGroup = { [key in ConstituentType]: Omit<Constituent, 'id'>[] };
const groupedConstituentsByType = CONSTITUENTS.reduce((group, cons) => {
  if (!group[cons.type]) group[cons.type] = [];
  group[cons.type].push(cons);
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
