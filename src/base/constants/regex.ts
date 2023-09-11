import { ABBREVIATIONS } from '@/base/constants/abbreviations';

export const DIGITS_PATTERN = /\d+/g;

/**
 * 콤마로 구분된 천 단위 숫자를 찾기 위한 정규식
 * 예시: "approximately 6,500 spoken" -> `6,500` 매칭
 *
 * - `\d{1,3}` 1~3개의 숫자(\d)가 연속해서 나타나는 패턴 탐색. (예: 1, 12, 123)
 * - `(?:,\d{3})+` 콤마(,) 뒤에 숫자 3개가 오는 패턴 탐색.
 *   - `+` 앞 패턴이 1번 이상 반복.
 *   - `?:` 비캡처링 그룹화 -> 그룹화는 필요하지만 캡처화는 필요하지 않을 때 -> 메모리 절약
 */
export const NUM_WITH_COMMAS_REGEX = /(\d{1,3}(?:,\d{3})+)/g;

/** 단어 문자(영어/숫자/언더스코어)가 아니거나 아포스트로피(')가 아닌 모든 문자와 일치 (공백, 콤마 등) */
export const NON_WORD_CHAR_PATTERN = /([^\w'])/g;
export const PUNCTUATION_PATTERN = /([.,!?])/g;

/**
 * 3개 이상의 단어가 연속적으로 나타나고, 각 단어 사이에 콤마나 공백이 1개 이상 있는지 확인하는 정규식
 * 예시: "apple, banana, cherry" 또는 "apple banana cherry"
 *
 * - `\b\w+\b` 단어 경계(\b) 사이에 단어 문자(\w)가 1개 이상 있는지 확인 (예: 'apple')
 * - `[,\s]+` 콤마나 공백이 1개 이상 있는지 확인 (예: ', ' 또는 ' ')
 * - `(\b\w+\b[,\s]+){2,}` 위의 두 패턴이 2번 이상 연속으로 반복 (예: 'apple, banana, ')
 * - `\b\w+\b` 마지막에 나타나는 단어 (예: 'cherry')
 */
export const THREE_WORDS_PATTERN = /(\b\w+\b[,\s]+){2,}\b\w+\b/;
export const TWO_WORDS_PATTERN = /(\b\w+\b[,\s]+)\b\w+\b/;
export const ENGLISH_INPUT_PATTERN =
  /^[a-zA-Z0-9 .,!?'":;\-()/@#$%^&*_+=|<>{}[\]~`]*$/;

export const ABBREVIATIONS_PATTERNS = new RegExp(
  Object.keys(ABBREVIATIONS).join('|'),
  'g',
);
