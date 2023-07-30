import { RefObject } from 'react';
import { kebabToCamel } from '@/utils/string';
import { ConstituentType } from '@/types/analysis';

const assignCalculatedLevel = (element: HTMLElement) => {
  let maxChildLevel = 0;

  for (const child of element.children) {
    const childLevel = assignCalculatedLevel(child as HTMLElement);
    maxChildLevel = Math.max(maxChildLevel, childLevel);
  }

  const hasChild = element.children.length > 0;
  const currentLevel = hasChild ? maxChildLevel + 1 : maxChildLevel;

  const classesToCheck: ConstituentType[] = [
    'token',
    'phrase',
    'clause',
    'token-group',
  ];

  classesToCheck.forEach((className) => {
    if (element.classList.contains(className)) {
      element.dataset[kebabToCamel(`${className}-lv`)] = `${currentLevel}`;
    }
  });

  return currentLevel;
};

export const calculateNestingLevel = (ref: RefObject<HTMLElement>) => {
  const childElements = ref.current?.children;
  if (!childElements) return;

  Array.from(childElements).forEach((span) => {
    const spanElement = span as HTMLElement;
    if (spanElement.dataset.constituentId) assignCalculatedLevel(spanElement);
  });
};
