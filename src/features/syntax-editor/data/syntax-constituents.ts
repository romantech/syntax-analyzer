import {
  ConstituentType,
  ConstituentWithoutId,
} from '@/features/syntax-editor';

export const SYNTAX_CONSTITUENTS: ConstituentWithoutId[] = [
  {
    elementId: 1,
    label: 'subject',
    abbreviation: 's',
    type: 'token',
  },
  {
    elementId: 2,
    label: 'verb',
    abbreviation: 'v',
    type: 'token',
  },
  {
    elementId: 3,
    label: 'modal verb',
    abbreviation: 'mod',
    type: 'token',
  },
  {
    elementId: 4,
    label: 'object',
    abbreviation: 'o',
    type: 'token',
  },
  {
    elementId: 5,
    label: 'indirect object',
    abbreviation: 'i.o.',
    type: 'token',
  },
  {
    elementId: 6,
    label: 'direct object',
    abbreviation: 'd.o.',
    type: 'token',
  },
  {
    elementId: 7,
    label: 'prepositional object',
    abbreviation: 'prp.o.',
    type: 'token',
  },
  {
    elementId: 8,
    label: 'complement',
    abbreviation: 'c',
    type: 'token',
  },
  {
    elementId: 9,
    label: 'object complement',
    abbreviation: 'o.c.',
    type: 'token',
  },
  {
    elementId: 10,
    label: 'to-infinitive',
    abbreviation: 'to-inf',
    type: 'token',
  },
  {
    elementId: 11,
    label: 'gerund',
    abbreviation: 'g',
    type: 'token',
  },
  {
    elementId: 12,
    label: 'participle',
    abbreviation: 'pt',
    type: 'token',
  },
  {
    elementId: 13,
    label: 'coordinating conjunction',
    abbreviation: 'co.t',
    type: 'token',
  },
  {
    elementId: 14,
    label: 'participle phrase',
    abbreviation: 'pt.phr',
    type: 'phrase',
  },
  {
    elementId: 15,
    label: 'prepositional phrase',
    abbreviation: 'prp.phr',
    type: 'phrase',
  },
  {
    elementId: 16,
    label: 'noun phrase',
    abbreviation: 'n.phr',
    type: 'phrase',
  },
  {
    elementId: 17,
    label: 'adverbial phrase',
    abbreviation: 'adv.phr',
    type: 'phrase',
  },
  {
    elementId: 18,
    label: 'verb phrase',
    abbreviation: 'v.phr',
    type: 'phrase',
  },
  {
    elementId: 19,
    label: 'adjectival phrase',
    abbreviation: 'adj.phr',
    type: 'phrase',
  },
  {
    elementId: 20,
    label: 'gerund phrase',
    abbreviation: 'g.phr',
    type: 'phrase',
  },
  {
    elementId: 21,
    label: 'infinitive phrase',
    abbreviation: 'inf.phr',
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
export const groupedConstituentsByType = SYNTAX_CONSTITUENTS.reduce(
  (group, constituent) => {
    if (!group[constituent.type]) group[constituent.type] = [];
    group[constituent.type].push(constituent);
    return group;
  },
  {} as ConstituentGroup,
);
