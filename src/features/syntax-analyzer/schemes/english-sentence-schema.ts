import * as yup from 'yup';
import { ENGLISH_INPUT_PATTERN, THREE_WORDS_PATTERN } from '@/base';
import {
  MAX_SENTENCE_LENGTH,
  MIN_SENTENCE_WORDS,
} from '@/features/syntax-analyzer';

export const HELPER_MESSAGES = {
  ENGLISH_OR_SYMBOL: 'Only English or punctuation can be entered',
  MIN_WORDS: `Please enter a sentence consisting of at least ${MIN_SENTENCE_WORDS} words`,
  MAX_LENGTH: `You can only enter up to ${MAX_SENTENCE_LENGTH} characters`,
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
