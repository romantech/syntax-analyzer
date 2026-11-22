import * as yup from 'yup';

import { ENGLISH_INPUT_PATTERN, THREE_WORDS_PATTERN } from '@/base/constants/regex';
import { MAX_SENTENCE_LENGTH } from '@/features/syntax-analyzer/constants';

export const englishInputSchema = yup
  .string()
  .trim()
  .matches(ENGLISH_INPUT_PATTERN, 'validation.englishOnly');

export const threeWordsSchema = yup
  .string()
  .trim()
  .matches(THREE_WORDS_PATTERN, 'validation.sentenceMin');

export const englishSentenceSchema = yup
  .string()
  .trim()
  .max(MAX_SENTENCE_LENGTH, 'validation.sentenceMax')
  .concat(englishInputSchema)
  .concat(threeWordsSchema);
