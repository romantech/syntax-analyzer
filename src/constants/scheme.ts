import { ENGLISH_INPUT_PATTERN, TWO_WORDS_PATTERN } from '@/constants/regex';
import * as yup from 'yup';
import { AnalysisModel } from '@/types/analysis';

const sentenceSchema = yup
  .string()
  .trim()
  .max(90)
  .matches(ENGLISH_INPUT_PATTERN, '영어 혹은 문장 부호만 입력할 수 있어요')
  .matches(TWO_WORDS_PATTERN, '올바른 영어 문장을 입력해주세요');

export const addSentenceSchema = yup.object({
  sentence: sentenceSchema.required(),
});

export const analyzeSentenceSchema = yup.object({
  model: yup
    .mixed<AnalysisModel>()
    .oneOf(['gpt-3.5-turbo', 'gpt-4'])
    .required(),
  sentence: sentenceSchema.required(),
});
