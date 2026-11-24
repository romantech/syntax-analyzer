import * as yup from 'yup';

import { englishSentenceSchema } from './english-sentence-schema';

export const addSentenceFormSchema = yup.object({
  sentence: englishSentenceSchema.required('validation.sentenceRequired').ensure(),
});

export const createAnalysisFormSchema = yup.object({
  sentence: englishSentenceSchema.ensure(),
});
