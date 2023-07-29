import { Nullable } from '@/types/common';
import { ConstituentType, ConstituentWithoutId } from '@/types/analysis';
import { generateNumberID } from '@/utils/identifier';

export const getNearestConstituent = (elementParam: Nullable<HTMLElement>) => {
  let element = elementParam;
  while (element) {
    if (element.dataset.constituent) return element;
    element = element.parentElement;
  }
  return null;
};
export const transformConstituentType = (
  type: ConstituentType,
  begin: number,
  end: number,
): ConstituentType => {
  const isDistanceGreaterThanOne = Math.abs(begin - end) > 1;
  switch (type) {
    case 'token':
      return isDistanceGreaterThanOne ? 'token-group' : 'token';
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