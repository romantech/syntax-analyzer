import * as yup from 'yup';

import { AnalysisModel } from '@/features/syntax-analyzer';

import { englishSentenceSchema } from './english-sentence-schema';

export const addSentenceFormSchema = yup.object({
  sentence: englishSentenceSchema.required().ensure(),
});

export const createAnalysisFormSchema = yup.object({
  model: yup
    .mixed<AnalysisModel>()
    .oneOf(Object.values(AnalysisModel))
    .default(AnalysisModel.GPT_4O_MINI_FT),
  sentence: englishSentenceSchema.ensure(),
});
