import type { RefObject } from 'react';

import { kebabToCamel } from '@/base';
import { CONSTITUENT_CLASSES } from '@/features/syntax-editor';

const LABEL_GAP = 4;

const fitLabelWidth = (element: HTMLElement): number => {
  const labels = element.querySelector(':scope > .constituent-labels > .constituent-label-content');
  if (!labels) return 0;

  delete element.dataset.stackedLabels;
  const segmentWidth = element.getBoundingClientRect().width;
  let labelWidth = labels.getBoundingClientRect().width;
  let extraRows = 0;
  const primary = labels.firstElementChild;

  if (primary?.getAttribute('aria-expanded') === 'true' && labels.children.length > 1) {
    const { width, height } = primary.getBoundingClientRect();
    const availableWidth = Math.max(segmentWidth - LABEL_GAP, width);
    if (labelWidth > availableWidth) {
      element.style.setProperty('--constituent-label-max-width', `${availableWidth}px`);
      element.dataset.stackedLabels = '';
      labelWidth = width;
      extraRows = Math.ceil(labels.getBoundingClientRect().height / height) - 1;
    }
  }

  const extraWidth = labelWidth + LABEL_GAP - segmentWidth;
  if (extraWidth > 0) {
    element.style.setProperty('--constituent-label-inline-space', `${extraWidth / 2}px`);
  }
  return extraRows;
};

const assignCalculatedLevel = (element: HTMLElement): number => {
  if (element.classList.contains('constituent-labels')) return 0;
  let maxChildLevel = 0;

  for (const child of element.children) {
    const childLevel = assignCalculatedLevel(child as HTMLElement);
    maxChildLevel = Math.max(maxChildLevel, childLevel);
  }

  const classesToCheck = [CONSTITUENT_CLASSES.TOKEN, CONSTITUENT_CLASSES.TOKEN_GROUP];
  const isConstituent = classesToCheck.some((className) => element.classList.contains(className));
  const currentLevel = maxChildLevel + (isConstituent ? 1 : 0);

  classesToCheck.forEach((className) => {
    if (element.classList.contains(className)) {
      element.dataset[kebabToCamel(`${className}-lv`)] = `${currentLevel}`;
    }
  });

  // Keep the connector aligned with the first row and reserve lower rows for ancestors.
  return currentLevel + (isConstituent ? fitLabelWidth(element) : 0);
};

export const calculateNestingLevel = (ref: RefObject<HTMLElement | null>, isTapMode = false) => {
  const sentence = ref.current;
  if (!sentence) return;

  // Recompute from the original token widths when a shorter label replaces a longer one.
  for (const constituent of sentence.querySelectorAll<HTMLElement>(
    `.${CONSTITUENT_CLASSES.CONSTITUENT}`,
  )) {
    constituent.style.removeProperty('--constituent-label-inline-space');
  }

  assignCalculatedLevel(sentence);

  // 절대 위치 라벨도 모바일 문장 스크롤 영역의 높이에 포함한다.
  sentence.style.paddingBottom = '0px';
  const bottom = sentence.getBoundingClientRect().bottom;
  const labelBottom = Math.max(
    bottom,
    ...Array.from(
      sentence.querySelectorAll('.constituent-labels'),
      (label) => label.getBoundingClientRect().bottom,
    ),
  );
  sentence.style.paddingBottom = `${labelBottom - bottom + (isTapMode ? 16 : 8)}px`;
};
