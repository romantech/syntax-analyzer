import * as yup from 'yup';
import { ENGLISH_INPUT_PATTERN, THREE_WORDS_PATTERN } from '@/constants/regex';

export const addSentenceSchema = yup
  .string()
  .trim()
  .max(90)
  .matches(ENGLISH_INPUT_PATTERN, '영어 혹은 문장 부호만 입력할 수 있습니다')
  .matches(THREE_WORDS_PATTERN, '올바른 영어 문장을 입력해주세요');
