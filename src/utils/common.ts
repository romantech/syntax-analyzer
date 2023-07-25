import { NonWordCharPattern } from '@/constants/regex';

/** split(/\s+/) : 1개 이상의 연속된 공백을 기준으로 분리 */
export const tokenizer = (text: string) => {
  return text.replace(NonWordCharPattern, ' $1 ').split(/\s+/).filter(Boolean);
};
