import * as yup from 'yup';
import { ENGLISH_INPUT_PATTERN, THREE_WORDS_PATTERN } from '@/base';
import {
  MAX_SENTENCE_LENGTH,
  MIN_SENTENCE_WORDS,
} from '@/features/syntax-editor/constants';

export const HELPER_MESSAGES = {
  ENGLISH_OR_SYMBOL: '영어 혹은 문장 부호만 입력할 수 있어요',
  MIN_WORDS: `최소 ${MIN_SENTENCE_WORDS} 단어로 이루어진 문장을 입력해 주세요`,
  MAX_LENGTH: `최대 ${MAX_SENTENCE_LENGTH}자까지만 입력할 수 있어요`,
} as const;

export const englishInputSchema = yup
  .string()
  .trim()
  .matches(ENGLISH_INPUT_PATTERN, HELPER_MESSAGES.ENGLISH_OR_SYMBOL);

export const threeWordsSchema = yup
  .string()
  .trim()
  .matches(THREE_WORDS_PATTERN, HELPER_MESSAGES.MIN_WORDS);

export const englishSentenceSchema = yup
  .string()
  .trim()
  .max(MAX_SENTENCE_LENGTH, HELPER_MESSAGES.MAX_LENGTH)
  .concat(englishInputSchema)
  .concat(threeWordsSchema);
