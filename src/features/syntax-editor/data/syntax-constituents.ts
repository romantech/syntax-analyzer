import {
  ConstituentType,
  ConstituentWithoutId,
} from '@/features/syntax-editor';

export const syntaxConstituents: ConstituentWithoutId[] = [
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

type ConstituentGroup = { [key in ConstituentType]: ConstituentWithoutId[] };
export const groupedConstituentsByType = syntaxConstituents.reduce(
  (group, constituent) => {
    if (!group[constituent.type]) group[constituent.type] = [];
    group[constituent.type].push(constituent);
    return group;
  },
  {} as ConstituentGroup,
);
