import { Nullable } from '@/types/common';
import { ConstituentType, ConstituentWithoutId } from '@/types/analysis';
import { generateNumberID } from '@/utils/identifier';

export const getNearestElementByClass = (
  elementParam: Nullable<HTMLElement>,
  className: string = 'constituent',
) => {
  let element = elementParam;
  while (element) {
    if (element.classList.contains(className)) return element;
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
