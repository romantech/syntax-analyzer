import * as yup from 'yup';

import { AnalysisModel } from '@/features/syntax-analyzer';

import { englishSentenceSchema } from './english-sentence-schema';

export const addSentenceFormSchema = yup.object({
  sentence: englishSentenceSchema.required().ensure(),
});

export const createAnalysisFormSchema = yup.object({
  model: yup
    .mixed<AnalysisModel>()
    .oneOf(['gpt-3.5-turbo', 'gpt-4'])
    .default('gpt-3.5-turbo'),
  sentence: englishSentenceSchema.ensure(),
});
