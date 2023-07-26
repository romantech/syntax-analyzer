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

export const ConstituentTranslations: Record<EnglishLabels, string> = {
  subject: '주어',
  verb: '동사',
  'auxiliary verb': '조동사',
  'modal verb': '법조동사',
  object: '목적어',
  'indirect object': '간접 목적어',
  'direct object': '직접 목적어',
  'prepositional object': '전치사 목적어',
  complement: '보어',
  'object complement': '목적보어',
  'to-infinitive': 'to부정사',
  'infinitive object': '부정사 목적어',
  gerund: '동명사',
  'gerund object': '동명사 목적어',
  participle: '분사',
  'participle object': '분사 목적어',
  'participle phrase': '분사 구문',
  'prepositional phrase': '전치사구',
  'adverbial phrase': '부사구',
  'adjectival phrase': '형용사구',
  'coordinating conjunction': '등위어',
  'coordinating clause': '등위절',
  'parallel clause': '병렬절',
  'noun clause': '명사절',
  'adjectival clause': '형용사절',
  'adverbial clause': '부사절',
  'inserted clause': '삽입절',
  'relative clause': '관계절',
  'dependent clause': '의존절',
  'independent clause': '독립절',
};

type ConstituentGroup = { [key in ConstituentType]: Omit<Constituent, 'id'>[] };
const groupedConstituentsByType = CONSTITUENTS.reduce((group, cons) => {
  if (!group[cons.type]) group[cons.type] = [];
  group[cons.type].push(cons);
  return group;
}, {} as ConstituentGroup);

export const CONSTITUENT_CATEGORIES = [
  {
    label: 'general | 주어/동사 등',
    constituents: groupedConstituentsByType.token,
  },
  {
    label: 'phrase | 전치사구/동명사구 등',
    constituents: groupedConstituentsByType.phrase,
  },
  {
    label: 'clause | 독립절/의존절 등',
    constituents: groupedConstituentsByType.clause,
  },
];
