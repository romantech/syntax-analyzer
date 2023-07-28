import { RefObject } from 'react';
import { ConstituentType } from '@/types/analysis.ts';
import { kebabToCamel } from '@/utils/common.ts';

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
  const spans = ref.current?.children;
  if (!spans) return;

  Array.from(spans).forEach((span) => {
    const spanElement = span as HTMLElement;
    if (spanElement.dataset.constituent) assignCalculatedLevel(spanElement);
  });
};
