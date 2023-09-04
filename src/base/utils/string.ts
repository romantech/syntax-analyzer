import {
  ABBREVIATIONS,
  ABBREVIATIONS_PATTERNS,
  NON_WORD_CHAR_PATTERN,
  PUNCTUATION_PATTERN,
} from '@/base/constants';

/**
 * Checks if a given token is a punctuation.
 *
 * @param {string} token - The token to check.
 * @return {boolean} True if the token is a punctuation, false otherwise.
 */
export const isPunctuation = (token?: string): boolean =>
  Boolean(token?.match(PUNCTUATION_PATTERN));

/** split(/\s+/) : 1개 이상의 연속된 공백을 기준으로 분리 */
export const tokenizer = (text: string) => {
  return text
    .replace(NON_WORD_CHAR_PATTERN, ' $1 ')
    .split(/\s+/)
    .filter(Boolean);
};

/**
 * Joins an array of tokens into a single string, separating them with spaces.
 *
 * @param {ReturnType<typeof tokenizer>} tokens - The array of tokens to be joined.
 * @return {string} - The joined string.
 */
export const tokenJoiner = (tokens: ReturnType<typeof tokenizer>): string => {
  return tokens.reduce((prev, cur) => {
    if (cur.match(NON_WORD_CHAR_PATTERN)) return prev + cur;
    else return prev + ' ' + cur;
  }, '');
};

/**
 * Replaces kebab-case with camelCase.
 *
 * @param {string} str - The kebab-case string to be converted.
 * @return {string} The camelCase string.
 */
export const kebabToCamel = (str: string): string => {
  /**
   * -([a-z]) : -로 시작하고 소문자로 끝나는 문자열
   * e.g. hello-world -> '-w' 매칭
   * 매칭된 문자열은 replacer 함수의 첫번째 인자로 전달됨
   * */
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Replaces abbreviations in a sentence with their expanded forms.
 *
 * @param {string} sentence - The sentence to expand abbreviations in.
 * @return {string} The sentence with abbreviations expanded.
 */
export const expandAbbreviations = (sentence: string): string => {
  return sentence.replace(
    ABBREVIATIONS_PATTERNS,
    (match) => ABBREVIATIONS[match],
  );
};
