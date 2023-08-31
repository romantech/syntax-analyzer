import { TConstituent } from '@/features/syntax-editor';

type EnglishLabels = Extract<TConstituent, { label: string }>['label'];
type ConstituentTranslation = { ko: string; desc: string };

export const CONSTITUENT_TRANSLATIONS: Record<
  EnglishLabels,
  ConstituentTranslation
> = {
  subject: {
    ko: '주어',
    desc: '문장의 주체를 나타내는 단어나 구',
  },
  verb: {
    ko: '동사',
    desc: '문장의 동작이나 상태를 나타내는 단어',
  },
  'modal verb': {
    ko: '조동사',
    desc: '다른 동사와 쓰여 의미를 부여하는 동사',
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
    ko: 'to 부정사',
    desc: "'to'와 함께 사용되는 동사의 기본형",
  },
  gerund: {
    ko: '동명사',
    desc: '동사에 -ing를 붙여 명사로 사용하는 형태',
  },
  participle: {
    ko: '분사',
    desc: '동사의 과거 분사나 현재 분사 형태',
  },
  conjunction: {
    ko: '접속사',
    desc: '문법적으로 연결하는 단어',
  },
  'participle phrase': {
    ko: '분사구',
    desc: '분사와 그 관련 구성요소로 이루어진 구문',
  },
  'prepositional phrase': {
    ko: '전치사구',
    desc: '전치사와 그 객체로 이루어진 구',
  },
  'noun phrase': {
    ko: '명사구',
    desc: '명사와 그와 관련된 수식어들로 이루어진 구',
  },
  'adverbial phrase': {
    ko: '부사구',
    desc: '문장 내에서 부사의 역할을 하는 구',
  },
  'verb phrase': {
    ko: '동사구',
    desc: '문장 내에서 동사의 역할을 하는 구',
  },
  'adjectival phrase': {
    ko: '형용사구',
    desc: '문장 내에서 형용사의 역할을 하는 구',
  },
  'gerund phrase': {
    ko: '동명사구',
    desc: '동명사와 그와 관련된 단어들로 이루어진 구',
  },
  'infinitive phrase': {
    ko: '부정사구',
    desc: "'to'와 동사 기본형 및 관련 구성요소로 이루어진 구",
  },
  'coordinating clause': {
    ko: '등위절',
    desc: '동일한 중요도를 가진 두 개 이상의 절',
  },
  'parallel clause': {
    ko: '병렬절',
    desc: '동일한 문법 구조를 갖는 두 개 이상의 절',
  },
  'noun clause': {
    ko: '명사절',
    desc: '문장에서 명사 역할을 하는 절',
  },
  'adjectival clause': {
    ko: '형용사절',
    desc: '문장에서 형용사 역할을 하는 절',
  },
  'adverbial clause': {
    ko: '부사절',
    desc: '문장에서 부사 역할을 하는 절',
  },
  'inserted clause': {
    ko: '삽입절',
    desc: '다른 절 속에 삽입된 절',
  },
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
    desc: '독립적으로 완전한 의미를 가진 절',
  },
  adverb: {
    ko: '부사',
    desc: '동사, 형용사, 부사를 수식하는 단어',
  },
};
