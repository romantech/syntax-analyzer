import type { RefObject } from 'react';

import { kebabToCamel } from '@/base';
import { CONSTITUENT_CLASSES } from '@/features/syntax-editor';

const LABEL_GAP = 4;

const limitLabelWidth = (element: HTMLElement, width: number, stacked: boolean) => {
  element.style.setProperty('--constituent-label-max-width', `${width}px`);
  element.dataset.labelWidthLimited = '';
  if (stacked) element.dataset.stackedLabels = '';
};

const measureBaselineWidth = (label: HTMLElement, withCaret: boolean) => {
  // Measure the collapsed label even when the full view removes its disclosure button.
  label.dataset.measureBaseline = withCaret ? 'disclosure' : '';
  const { width } = label.getBoundingClientRect();
  delete label.dataset.measureBaseline;
  return width;
};

const fitLabelWidth = (element: HTMLElement, labels: Element) => {
  delete element.dataset.labelWidthLimited;
  delete element.dataset.stackedLabels;
  const segmentWidth = element.getBoundingClientRect().width;
  let labelWidth = labels.getBoundingClientRect().width;
  const primary = labels.firstElementChild;
  if (!primary) return;

  if (element.hasAttribute('data-detail-only')) {
    const minimumWidth = Number.parseFloat(getComputedStyle(primary).minWidth);
    const availableWidth = Math.max(segmentWidth, minimumWidth);
    if (labelWidth > availableWidth) {
      limitLabelWidth(element, availableWidth, labels.children.length > 1);
    }
    return;
  }

  const baselineRoleId = element.dataset.baselineRoleId;
  const withCaret = element.hasAttribute('data-baseline-disclosure');
  if (baselineRoleId && (labels.children.length > 1 || withCaret)) {
    const baselineLabel = labels.querySelector<HTMLElement>(
      `[data-constituent-id="${baselineRoleId}"]`,
    );
    if (baselineLabel) {
      const width = measureBaselineWidth(baselineLabel, withCaret);
      const availableWidth = Math.max(segmentWidth - LABEL_GAP, width);
      if (labelWidth > availableWidth) {
        limitLabelWidth(element, availableWidth, true);
      }
      labelWidth = width;
    }
  }

  const extraWidth = labelWidth + LABEL_GAP - segmentWidth;
  if (extraWidth > 0) {
    element.style.setProperty('--constituent-label-inline-space', `${extraWidth / 2}px`);
  }
};

const assignCalculatedLevel = (element: HTMLElement): { level: number; bottom: number } => {
  let maxChildLevel = 0;
  let maxChildBottom = Number.NEGATIVE_INFINITY;

  for (const child of element.children) {
    if (child.classList.contains('constituent-labels')) continue;
    const { level, bottom } = assignCalculatedLevel(child as HTMLElement);
    maxChildLevel = Math.max(maxChildLevel, level);
    maxChildBottom = Math.max(maxChildBottom, bottom);
  }

  const classesToCheck = [CONSTITUENT_CLASSES.TOKEN, CONSTITUENT_CLASSES.TOKEN_GROUP];
  const constituentClass = classesToCheck.find((className) =>
    element.classList.contains(className),
  );
  if (!constituentClass) return { level: maxChildLevel, bottom: maxChildBottom };

  const level = maxChildLevel + 1;
  element.dataset[kebabToCamel(`${constituentClass}-lv`)] = `${level}`;
  const frame = element.querySelector(':scope > .constituent-labels');
  if (!frame?.firstElementChild) return { level, bottom: maxChildBottom };

  fitLabelWidth(element, frame.firstElementChild);
  const { top, bottom } = frame.getBoundingClientRect();
  // Move the label and its connector together past the measured end of the child cards.
  const offset = Math.max(0, maxChildBottom - top);
  if (offset > 0) element.style.setProperty('--constituent-label-offset', `${offset}px`);
  return { level, bottom: bottom + offset };
};

export const calculateNestingLevel = (ref: RefObject<HTMLElement | null>, isTapMode = false) => {
  const sentence = ref.current;
  if (!sentence) return;

  // Recompute from the original token widths and label positions after each display change.
  for (const constituent of sentence.querySelectorAll<HTMLElement>(
    `.${CONSTITUENT_CLASSES.CONSTITUENT}`,
  )) {
    constituent.style.removeProperty('--constituent-label-inline-space');
    constituent.style.removeProperty('--constituent-label-offset');
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
