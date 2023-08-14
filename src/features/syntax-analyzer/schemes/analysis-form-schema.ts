import * as yup from 'yup';
import { englishSentenceSchema } from './english-sentence-schema';
import { AnalysisModel } from '@/features/syntax-analyzer';

export const addSentenceFormSchema = yup.object({
  sentence: englishSentenceSchema.required().ensure(),
});

export const createAnalysisFormSchema = yup.object({
  model: yup
    .mixed<AnalysisModel>()
    .oneOf(['gpt-3.5-turbo', 'gpt-4'])
    .required(),
  sentence: englishSentenceSchema.required(),
});
