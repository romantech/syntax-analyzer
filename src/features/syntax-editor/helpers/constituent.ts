import { generateNumberID } from '@/base';
import {
  ConstituentType,
  ConstituentWithoutId,
} from '@/features/syntax-editor';

export const isMultipleTokensInRange = (begin: number, end: number) => {
  return Math.abs(begin - end) > 1;
};

export const transformConstituentType = (
  type: ConstituentType,
  begin: number,
  end: number,
): ConstituentType => {
  const hasMultipleTokens = isMultipleTokensInRange(begin, end);
  switch (type) {
    case 'token':
      return hasMultipleTokens ? 'token-group' : 'token';
    default:
      return type;
  }
};

export const generateConstituent = (
  selectedTag: ConstituentWithoutId,
  begin: number,
  end: number,
) => {
  return {
    ...selectedTag,
    id: generateNumberID(),
    type: transformConstituentType(selectedTag.type, begin, end),
  };
};
