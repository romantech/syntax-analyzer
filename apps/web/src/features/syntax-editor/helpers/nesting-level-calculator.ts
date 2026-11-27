import type { RefObject } from 'react';

import { kebabToCamel } from '@/base';
import { CONSTITUENT_CLASSES } from '@/features/syntax-editor';

const LABEL_GAP = 4;

const limitLabelWidth = (element: HTMLElement, labels: Element, width: number) => {
  element.style.setProperty('--constituent-label-max-width', 'min-content');
  element.dataset.labelWidthLimited = '';
  if (labels.children.length > 1) element.dataset.stackedLabels = '';

  // A label needs room for its longest word, padding, and disclosure caret.
  const minimumWidth = labels.getBoundingClientRect().width;
  element.style.setProperty('--constituent-label-max-width', `${Math.max(width, minimumWidth)}px`);
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
      limitLabelWidth(element, labels, availableWidth);
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
        limitLabelWidth(element, labels, availableWidth);
      }
      labelWidth = width;
    }
  }

  const extraWidth = labelWidth + LABEL_GAP - segmentWidth;
  if (extraWidth > 0) {
    element.style.setProperty('--constituent-label-inline-space', `${extraWidth / 2}px`);
  }
};

interface LabelCard {
  element: HTMLElement;
  frame: Element;
  content: Element;
  level: number;
}

const assignCalculatedLevel = (element: HTMLElement, cards: LabelCard[]): number => {
  let maxChildLevel = 0;

  for (const child of element.children) {
    if (!(child instanceof HTMLElement) || child.classList.contains('constituent-labels')) continue;
    maxChildLevel = Math.max(maxChildLevel, assignCalculatedLevel(child, cards));
  }

  const classesToCheck = [CONSTITUENT_CLASSES.TOKEN, CONSTITUENT_CLASSES.TOKEN_GROUP];
  const constituentClass = classesToCheck.find((className) =>
    element.classList.contains(className),
  );
  if (!constituentClass) return maxChildLevel;

  const level = maxChildLevel + 1;
  element.dataset[kebabToCamel(`${constituentClass}-lv`)] = `${level}`;
  const frame = element.querySelector(':scope > .constituent-labels');
  const content = frame?.firstElementChild;
  if (frame && content) {
    fitLabelWidth(element, content);
    cards.push({ element, frame, content, level });
  }
  return level;
};

interface CardBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const placeLabelCards = (sentence: HTMLElement, cards: LabelCard[]) => {
  const { left: sentenceLeft, right: sentenceRight } = sentence.getBoundingClientRect();
  const viewport = sentence.closest<HTMLElement>('[role="region"]');
  const start = viewport
    ? viewport.getBoundingClientRect().left + viewport.clientLeft - viewport.scrollLeft
    : sentenceLeft;

  // Measure after all inline spacing is set. Use the final content width even while
  // a disclosure frame is transitioning to that width.
  const measured = cards
    .sort((a, b) => a.level - b.level)
    .map(({ element, frame, content }) => {
      const { x, width, top, height } = frame.getBoundingClientRect();
      const contentWidth = content.getBoundingClientRect().width;
      const centeredLeft = x + (width - contentWidth) / 2;
      // Keep edge labels readable within the existing horizontal scroll area.
      const left = Math.max(start, Math.min(centeredLeft, sentenceRight - contentWidth));
      return {
        element,
        left,
        right: left + contentWidth,
        inlineOffset: left - centeredLeft,
        top,
        height,
      };
    });

  const placed: CardBounds[] = [];
  const childBottoms = new Map<Element, number>();
  let labelBottom = Number.NEGATIVE_INFINITY;
  for (const { element, left, right, inlineOffset, top, height } of measured) {
    let nextTop = Math.max(top, childBottoms.get(element) ?? top);
    for (const card of placed) {
      if (card.top >= nextTop + height) break;
      if (left < card.right && right > card.left && nextTop < card.bottom) {
        nextTop = card.bottom;
      }
    }
    const offset = nextTop - top;
    if (offset > 0) element.style.setProperty('--constituent-label-offset', `${offset}px`);
    if (inlineOffset !== 0) {
      element.style.setProperty('--constituent-label-inline-offset', `${inlineOffset}px`);
    }

    const bottom = nextTop + height;
    placed.push({ left, right, top: nextTop, bottom });
    placed.sort((a, b) => a.top - b.top);
    const parent = element.parentElement?.closest(`.${CONSTITUENT_CLASSES.CONSTITUENT}`);
    if (parent) childBottoms.set(parent, Math.max(childBottoms.get(parent) ?? bottom, bottom));
    labelBottom = Math.max(labelBottom, bottom);
  }
  return labelBottom;
};

export const calculateNestingLevel = (ref: RefObject<HTMLElement | null>, isTapMode = false) => {
  const sentence = ref.current;
  if (!sentence) return;

  // Recompute from the original token widths and label positions after each display change.
  for (const constituent of sentence.querySelectorAll<HTMLElement>(
    `.${CONSTITUENT_CLASSES.CONSTITUENT}`,
  )) {
    constituent.style.removeProperty('--constituent-label-inline-space');
    constituent.style.removeProperty('--constituent-label-inline-offset');
    constituent.style.removeProperty('--constituent-label-offset');
  }

  const cards: LabelCard[] = [];
  assignCalculatedLevel(sentence, cards);
  const labelBottom = placeLabelCards(sentence, cards);

  // 절대 위치 라벨도 모바일 문장 스크롤 영역의 높이에 포함한다.
  sentence.style.paddingBottom = '0px';
  const bottom = sentence.getBoundingClientRect().bottom;
  sentence.style.paddingBottom = `${Math.max(0, labelBottom - bottom) + (isTapMode ? 16 : 8)}px`;
};
