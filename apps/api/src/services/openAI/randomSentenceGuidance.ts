import { randomInt } from 'node:crypto';

const grammarCues = [
  'simple present for a habit or fact',
  'simple past for a completed action',
  'present progressive for an ongoing action',
  'present perfect for a past event with a present result',
  'future with will',
  'yes/no question',
  'wh-question',
  'imperative',
  'negative statement',
  'passive voice',
  'conditional with if',
  'subordinate clause expressing time or reason',
];

const situationCues = [
  'a small object that matters',
  'a sound, smell, or texture',
  'a local rule or custom',
  'a choice with a trade-off',
  'a quiet moment before or after an event',
  'a mistake someone corrects',
  'a detail people often overlook',
  "a change in someone's opinion",
  'a message or sign someone encounters',
  'a task people do together',
];

export const randomSentenceGuidance = (count: number) => {
  const grammar = [...grammarCues];
  const situations = [...situationCues];
  const cues = Array.from({ length: count }, (_, index) => {
    const [form] = grammar.splice(randomInt(grammar.length), 1);
    const [scene] = situations.splice(randomInt(situations.length), 1);
    return `${index + 1}. Grammar: ${form}. Situation: ${scene}.`;
  });

  return [
    'Use a different subject, main verb, opening, and situation for each sentence. Avoid repeating a pattern with only a few words swapped.',
    'Use the numbered cues for the corresponding sentences. Ground each situation in a specific detail related to the supplied topic, if any.',
    'Treat the cues as flexible. If a cue clashes with the topic, character limit, or natural phrasing, simplify or skip it while following the requirements above.',
    ...cues,
  ].join('\n');
};
