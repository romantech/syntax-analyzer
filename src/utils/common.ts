import { NonWordCharPattern, PunctuationPattern } from '@/constants/regex';
import { customAlphabet } from 'nanoid';

export const isPunctuation = (token?: string) =>
  Boolean(token?.match(PunctuationPattern));

/** split(/\s+/) : 1개 이상의 연속된 공백을 기준으로 분리 */
export const tokenizer = (text: string) => {
  return text.replace(NonWordCharPattern, ' $1 ').split(/\s+/).filter(Boolean);
};

const nanoId = customAlphabet('123456789', 10);
export const generateNumberID = () => Number(nanoId());
