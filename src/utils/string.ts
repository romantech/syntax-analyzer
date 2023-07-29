import { NonWordCharPattern, PunctuationPattern } from '@/constants/regex';

export const isPunctuation = (token?: string) =>
  Boolean(token?.match(PunctuationPattern));

/** split(/\s+/) : 1개 이상의 연속된 공백을 기준으로 분리 */
export const tokenizer = (text: string) => {
  return text.replace(NonWordCharPattern, ' $1 ').split(/\s+/).filter(Boolean);
};

export const kebabToCamel = (str: string) => {
  /**
   * -([a-z]) : -로 시작하고 소문자로 끝나는 문자열
   * e.g. hello-world -> '-w' 매칭
   * 매칭된 문자열은 replacer 함수의 첫번째 인자로 전달됨
   * */
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};