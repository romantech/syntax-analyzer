import { ABBREVIATIONS } from '@/constants/abbreviations';

/** 단어 문자(영어/숫자/언더스코어)가 아니거나 아포스트로피(')가 아닌 모든 문자와 일치 (공백, 콤마 등) */
export const NON_WORD_CHAR_PATTERN = /([^\w'])/g;
export const PUNCTUATION_PATTERN = /([.,!?])/g;

/**
 * 세 개 이상의 단어가 있는지 확인하고, 단어 사이에는 콤마 또는 공백이 있음을 나타내는 패턴
 * \b\w+\b : \b 단어 경계 사이에 \w 단어 문자(알파벳/숫자/언더스코어)가 1개 이상 있는지 확인
 * [,\s]+ : 쉼표 또는 공백이 1개 이상 있는지 확인
 * (\b\w+\b[,\s]+){2,} : 소괄호 안에 있는 패턴이 2번 이상 반복
 * \b\w+\b : 마지막 단어
 * */
export const THREE_WORDS_PATTERN = /(\b\w+\b[,\s]+){2,}\b\w+\b/;
export const ENGLISH_INPUT_PATTERN =
  /^[a-zA-Z0-9 .,!?'":;\-()\/@#$%^&*_+=|<>{}\[\]~`]*$/;

export const ABBREVIATIONS_PATTERNS = new RegExp(
  Object.keys(ABBREVIATIONS).join('|'),
  'g',
);
