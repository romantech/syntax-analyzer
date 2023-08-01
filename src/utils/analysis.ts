import { Analysis, AnalysisSourceType } from '@/types/analysis';
import { nanoid } from 'nanoid';
import { generateNumberID } from '@/utils/identifier';
import { expandAbbreviations, tokenizer } from '@/utils/string';

export const generateAnalysis = (
  sentence: string,
  source: AnalysisSourceType,
): Analysis => {
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
  };
};
