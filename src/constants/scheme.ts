import { ENGLISH_INPUT_PATTERN, THREE_WORDS_PATTERN } from '@/constants/regex';
import * as yup from 'yup';
import { Model } from '@/pages/SyntaxAnalyzerPage';

const sentenceSchema = yup
  .string()
  .trim()
  .max(90)
  .matches(ENGLISH_INPUT_PATTERN, '영어 혹은 문장 부호만 입력할 수 있습니다')
  .matches(THREE_WORDS_PATTERN, '올바른 영어 문장을 입력해주세요');

export const addSentenceSchema = yup.object({
  sentence: sentenceSchema.required(),
});

export const analyzeSentenceSchema = yup.object({
  model: yup.mixed<Model>().oneOf(['3.5', '4']).required(),
  sentence: sentenceSchema.required(),
});
