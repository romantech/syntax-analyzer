import type { RefObject } from 'react';

import { kebabToCamel } from '@/base';
import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_DATA_ATTRS,
  getNumberAttr,
} from '@/features/syntax-editor';

const assignCalculatedLevel = (element: HTMLElement) => {
  let maxChildLevel = 0;

  for (const child of element.children) {
    const childLevel = assignCalculatedLevel(child as HTMLElement);
    maxChildLevel = Math.max(maxChildLevel, childLevel);
  }

  const hasChild = element.children.length > 0;
  const currentLevel = hasChild ? maxChildLevel + 1 : maxChildLevel;

  const classesToCheck = [CONSTITUENT_CLASSES.TOKEN, CONSTITUENT_CLASSES.TOKEN_GROUP];

  classesToCheck.forEach((className) => {
    if (element.classList.contains(className)) {
      element.dataset[kebabToCamel(`${className}-lv`)] = `${currentLevel}`;
    }
  });

  return currentLevel;
};

export const calculateNestingLevel = (ref: RefObject<HTMLElement | null>, isTapMode = false) => {
  const sentence = ref.current;
  if (!sentence) return;

  Array.from(sentence.children).forEach((span) => {
    const spanElement = span as HTMLElement;
    if (getNumberAttr(spanElement, CONSTITUENT_DATA_ATTRS.ID)) {
      assignCalculatedLevel(spanElement);
    }
  });

  // 절대 위치 라벨도 모바일 문장 스크롤 영역의 높이에 포함한다.
  sentence.style.paddingBottom = '0px';
  const bottom = sentence.getBoundingClientRect().bottom;
  const labelBottom = Math.max(
    bottom,
    ...Array.from(
      sentence.querySelectorAll('.constituent-label'),
      (label) => label.getBoundingClientRect().bottom,
    ),
  );
  sentence.style.paddingBottom = `${labelBottom - bottom + (isTapMode ? 16 : 8)}px`;
};
