import { ENGLISH_INPUT_PATTERN, THREE_WORDS_PATTERN } from '@/base';

import * as yup from 'yup';

export const englishInputSchema = yup
  .string()
  .trim()
  .matches(ENGLISH_INPUT_PATTERN, '영어 혹은 문장 부호만 입력할 수 있어요');

export const threeWordsSchema = yup
  .string()
  .trim()
  .matches(THREE_WORDS_PATTERN, '올바른 영어 문장을 입력해주세요');

export const englishSentenceSchema = yup
  .string()
  .trim()
  .max(90)
  .concat(englishInputSchema)
  .concat(threeWordsSchema);
