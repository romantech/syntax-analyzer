import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_DATA_ATTRS,
} from '@/features/syntax-editor';
import { getSelectionIndices } from '@/base';

const { INDEX, ID, BEGIN, END } = CONSTITUENT_DATA_ATTRS;
const TOKEN_GROUP_SELECTOR = '.' + CONSTITUENT_CLASSES.TOKEN_GROUP;

export const getAttributeAsNumber = (element: HTMLElement, key: string) =>
  Number(element.getAttribute(key));

const isSelectionEmpty = (begin: number, end: number) =>
  Math.abs(begin - end) === 0;

const hasNoTokenGroups = (startGroup: HTMLElement, endGroup: HTMLElement) =>
  !startGroup && !endGroup;

const isSelectionMatchingSegment = (
  begin: number,
  end: number,
  segmentBegin: number,
  segmentEnd: number,
) => begin === segmentBegin && end === segmentEnd;

const computeMaxRange = (
  element: HTMLElement,
  primaryAttr: string,
  secondaryAttr: string,
) => {
  let currentElement: HTMLElement | null = element;

  let primaryValue = getAttributeAsNumber(element, primaryAttr);
  let parentWithPrimaryValue = element;
  const secondaryValue = getAttributeAsNumber(element, secondaryAttr);

  while (
    currentElement &&
    secondaryValue === getAttributeAsNumber(currentElement, secondaryAttr)
  ) {
    const currentPrimaryValue = getAttributeAsNumber(
      currentElement,
      primaryAttr,
    );

    if (currentPrimaryValue !== primaryValue) {
      primaryValue = currentPrimaryValue;
      parentWithPrimaryValue = currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return {
    maxBegin: getAttributeAsNumber(parentWithPrimaryValue, BEGIN),
    maxEnd: getAttributeAsNumber(parentWithPrimaryValue, END),
  };
};

export const validateSelectionBounds = () => {
  const { begin, end, startNode, endNode } = getSelectionIndices(INDEX);
  const getReturnValue = (isValid: boolean) => ({ begin, end, isValid });

  const startGroup = startNode?.closest(TOKEN_GROUP_SELECTOR) as HTMLElement;
  const endGroup = endNode?.closest(TOKEN_GROUP_SELECTOR) as HTMLElement;

  if (isSelectionEmpty(begin, end)) return getReturnValue(false);
  if (hasNoTokenGroups(startGroup, endGroup)) return getReturnValue(true);

  if (!startGroup || !endGroup) {
    const group = startGroup ?? endGroup;

    const resultB = computeMaxRange(group, BEGIN, END);
    const resultE = computeMaxRange(group, END, BEGIN);

    const smallestBegin = Math.min(resultB.maxBegin, resultE.maxBegin);
    const largestEnd = Math.max(resultB.maxEnd, resultE.maxEnd);

    return getReturnValue(begin <= smallestBegin && end >= largestEnd);
  }

  const startId = getAttributeAsNumber(startGroup, ID);
  const endId = getAttributeAsNumber(endGroup, ID);

  const segmentBegin = getAttributeAsNumber(startGroup, BEGIN);
  const segmentEnd = getAttributeAsNumber(endGroup, END);

  if (isSelectionMatchingSegment(begin, end, segmentBegin, segmentEnd))
    return getReturnValue(true);

  if (startId !== endId) {
    if (
      (endGroup.contains(startGroup) && begin <= segmentBegin) ||
      (startGroup.contains(endGroup) && end >= segmentEnd)
    ) {
      return getReturnValue(true);
    }

    const { maxBegin, maxEnd } = computeMaxRange(startGroup, BEGIN, END);
    return getReturnValue(maxBegin === begin && maxEnd === end);
  }

  return getReturnValue(true);
};
