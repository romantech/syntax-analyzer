import * as yup from 'yup';

import { AnalysisModel } from '../constants';

import { englishSentenceSchema } from './english-sentence-schema';

export const addSentenceFormSchema = yup.object({
  sentence: englishSentenceSchema.required('validation.sentenceRequired').ensure(),
});

export const createAnalysisFormSchema = yup.object({
  model: yup
    .mixed<AnalysisModel>()
    .oneOf(Object.values(AnalysisModel))
    .default(AnalysisModel.FAST_FT),
  sentence: englishSentenceSchema.ensure(),
});
