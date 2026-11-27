import * as yup from 'yup';

import {
  MAX_ANALYSIS_TOKEN_LENGTH,
  MAX_ANALYSIS_TOKENS,
} from '../../../../../api/src/constants/analysis-limits.ts';
import { tokenizeAnalysisSentence } from '../helpers/tokenize-analysis-sentence';
import { englishSentenceSchema } from './english-sentence-schema';

export const addSentenceFormSchema = yup.object({
  sentence: englishSentenceSchema.required('validation.sentenceRequired').ensure(),
});

export const createAnalysisFormSchema = yup.object({
  sentence: englishSentenceSchema.ensure().test('analysis-tokens', (sentence, context) => {
    const tokens = tokenizeAnalysisSentence(sentence);
    if (tokens.length > MAX_ANALYSIS_TOKENS) {
      return context.createError({ message: 'validation.sentenceTokenMax' });
    }
    if (tokens.some((token) => token.length > MAX_ANALYSIS_TOKEN_LENGTH)) {
      return context.createError({ message: 'validation.sentenceTokenLength' });
    }
    return true;
  }),
});
