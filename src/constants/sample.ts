import { Analysis } from '@/types/analysis';
import { tokenizer } from '@/utils/string';
import { nanoid } from 'nanoid';
import { generateNumberID } from '@/utils/identifier';

const sentences = [
  'I am a boy who likes to play tennis which is fun.',
  'Many organizations need help with administrative tasks that can be completed digitally.',
  'Experts have identified a large number of measures that promote energy efficiency.',
];
const currentSentence = sentences[1];
const tokenized = tokenizer(currentSentence);

export const sampleData: Analysis = {
  id: nanoid(),
  sentence: tokenized,
  rootSegment: {
    id: generateNumberID(),
    begin: 0,
    end: tokenized.length,
    constituents: [],
    children: [],
  },
};
