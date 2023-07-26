import { Constituent } from '@/types/analysis';
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
