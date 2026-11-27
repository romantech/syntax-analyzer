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
  const availableWidth = Math.max(width, minimumWidth);
  element.style.setProperty('--constituent-label-max-width', `${availableWidth}px`);

  const label = labels.firstElementChild;
  if (labels.childElementCount !== 1 || !label?.matches('span')) return;

  // Keep the chosen line breaks but size the background to the widest line.
  const range = document.createRange();
  range.selectNodeContents(label);
  const lines = Array.from(range.getClientRects());
  if (lines.length < 2) return;

  const { paddingInlineStart, paddingInlineEnd } = getComputedStyle(label);
  const padding = Number.parseFloat(paddingInlineStart) + Number.parseFloat(paddingInlineEnd);
  const textWidth = Math.max(...lines.map((line) => line.width));
  const compactWidth = Math.max(minimumWidth, Math.ceil(textWidth + padding));
  if (compactWidth < availableWidth) {
    element.style.setProperty('--constituent-label-max-width', `${compactWidth}px`);
  }
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
  const naturalSize = labels.getBoundingClientRect();
  const labelWidth = naturalSize.width;
  const primary = labels.firstElementChild;
  if (!primary) return;

  if (element.hasAttribute('data-detail-only')) {
    const minimumWidth = Number.parseFloat(getComputedStyle(primary).minWidth);
    const availableWidth = Math.max(segmentWidth, minimumWidth);
    if (labelWidth > availableWidth) {
      limitLabelWidth(element, labels, availableWidth);
      if (labels.childElementCount === 1) return naturalSize;
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
    }
  }
};

interface LabelCard {
  element: HTMLElement;
  frame: Element;
  content: Element;
  level: number;
  unwrapped?: DOMRectReadOnly;
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
    const unwrapped = fitLabelWidth(element, content);
    cards.push({ element, frame, content, level, unwrapped });
  }
  return level;
};

interface CardBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface MeasuredCard extends CardBounds {
  element: HTMLElement;
  parent: HTMLElement | null;
  center: number;
  unwrapped?: DOMRectReadOnly;
}

const overlaps = (a: CardBounds, b: CardBounds) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const fitInsidePhrase = (
  { element, parent, center, unwrapped, top, bottom }: MeasuredCard,
  nextTop: number,
  start: number,
  end: number,
  cards: MeasuredCard[],
): CardBounds | undefined => {
  if (
    !unwrapped ||
    unwrapped.height >= bottom - top ||
    !parent?.classList.contains(CONSTITUENT_CLASSES.TOKEN_GROUP)
  ) {
    return;
  }

  const phrase = parent.getBoundingClientRect();
  let left = Math.max(start, phrase.left);
  let right = Math.min(end, phrase.right);

  // Keep the widened label between the neighboring dashed connectors.
  for (const sibling of cards) {
    if (
      sibling.parent !== parent ||
      sibling.element === element ||
      !sibling.element.classList.contains(CONSTITUENT_CLASSES.TOKEN_GROUP)
    ) {
      continue;
    }
    const segment = sibling.element.getBoundingClientRect();
    if (segment.right <= center) left = Math.max(left, segment.right);
    if (segment.left >= center) right = Math.min(right, segment.left);
  }
  if (right - left < unwrapped.width) return;

  left = Math.max(left, Math.min(center - unwrapped.width / 2, right - unwrapped.width));
  return { left, right: left + unwrapped.width, top: nextTop, bottom: nextTop + unwrapped.height };
};

const placeLabelCards = (sentence: HTMLElement, cards: LabelCard[]) => {
  const { left: sentenceLeft, right: sentenceRight } = sentence.getBoundingClientRect();
  const viewport = sentence.closest<HTMLElement>('[role="region"]');
  const start = viewport
    ? viewport.getBoundingClientRect().left + viewport.clientLeft - viewport.scrollLeft
    : sentenceLeft;

  // Use the final content width even while a disclosure frame is transitioning.
  const measured: MeasuredCard[] = cards
    .sort((a, b) => a.level - b.level)
    .map(({ element, frame, content, unwrapped }) => {
      const { x, width, top, bottom } = frame.getBoundingClientRect();
      const contentWidth = content.getBoundingClientRect().width;
      const center = x + width / 2;
      // Keep edge labels readable within the existing horizontal scroll area.
      const left = Math.max(
        start,
        Math.min(center - contentWidth / 2, sentenceRight - contentWidth),
      );
      return {
        element,
        parent:
          element.parentElement?.closest<HTMLElement>(`.${CONSTITUENT_CLASSES.CONSTITUENT}`) ??
          null,
        center,
        left,
        right: left + contentWidth,
        top,
        bottom,
        unwrapped,
      };
    });

  const placed: CardBounds[] = [];
  const childBottoms = new Map<Element, number>();
  let labelBottom = Number.NEGATIVE_INFINITY;
  for (const [index, card] of measured.entries()) {
    const { element, parent, center, left, right, top, bottom } = card;
    const nextTop = Math.max(top, childBottoms.get(element) ?? top);
    let bounds = { left, right, top: nextTop, bottom: nextTop + bottom - top };
    const unwrapped = fitInsidePhrase(card, nextTop, start, sentenceRight, measured);
    if (
      unwrapped &&
      !placed.some((other) => overlaps(unwrapped, other)) &&
      !measured.some((other, i) => i > index && overlaps(unwrapped, other))
    ) {
      delete element.dataset.labelWidthLimited;
      bounds = unwrapped;
    }
    for (const other of placed) {
      if (other.top >= bounds.bottom) break;
      if (overlaps(bounds, other)) {
        bounds.bottom += other.bottom - bounds.top;
        bounds.top = other.bottom;
      }
    }
    const offset = bounds.top - top;
    const inlineOffset = (bounds.left + bounds.right) / 2 - center;
    if (offset > 0) element.style.setProperty('--constituent-label-offset', `${offset}px`);
    if (inlineOffset !== 0) {
      element.style.setProperty('--constituent-label-inline-offset', `${inlineOffset}px`);
    }

    placed.push(bounds);
    placed.sort((a, b) => a.top - b.top);
    if (parent) {
      childBottoms.set(parent, Math.max(childBottoms.get(parent) ?? bounds.bottom, bounds.bottom));
    }
    labelBottom = Math.max(labelBottom, bounds.bottom);
  }
  return labelBottom;
};

export const calculateNestingLevel = (ref: RefObject<HTMLElement | null>, isTapMode = false) => {
  const sentence = ref.current;
  if (!sentence) return;

  // Recompute from the original label positions after each display change.
  for (const constituent of sentence.querySelectorAll<HTMLElement>(
    `.${CONSTITUENT_CLASSES.CONSTITUENT}`,
  )) {
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
