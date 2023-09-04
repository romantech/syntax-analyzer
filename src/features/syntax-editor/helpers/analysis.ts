import { nanoid } from 'nanoid';

import { expandAbbreviations, generateNumberID, tokenizer } from '@/base';

import type { AnalysisSource, TAnalysis } from '@/features/syntax-editor';

export const generateAnalysis = (
  sentence: string,
  source: AnalysisSource,
): TAnalysis => {
  const expandedSentence = expandAbbreviations(sentence);
  const tokenizedSentence = tokenizer(expandedSentence);

  return {
    id: nanoid(),
    source,
    sentence: tokenizedSentence,
    createdAt: new Date().toISOString(),
    rootSegment: {
      id: generateNumberID(),
      begin: 0,
      end: tokenizedSentence.length,
      constituents: [],
      children: [],
    },
    isAnalyzedByGPT: false,
  };
};

export const updateAnalysisMetaData = (analysis: TAnalysis) => ({
  ...analysis,
  id: nanoid(),
  createdAt: new Date().toISOString(),
});
