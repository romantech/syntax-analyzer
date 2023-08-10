import { CONSTITUENT_DATA_ATTRS } from '@/features/syntax-editor';
import { getSelectionIndices } from '@/base';

const { INDEX, ID, BEGIN, END } = CONSTITUENT_DATA_ATTRS;

export const getAttributeAsNumber = (element: HTMLElement, key: string) => {
  return Number(element.getAttribute(key));
};

const findLargestBeginEnd = (startElement: HTMLElement) => {
  let currentElement: HTMLElement | null = startElement;
  let largestEndValue = getAttributeAsNumber(startElement, END);
  let largestEndParent = startElement;

  const startBeginValue = getAttributeAsNumber(startElement, BEGIN);

  while (
    currentElement &&
    startBeginValue === getAttributeAsNumber(currentElement, BEGIN)
  ) {
    const endValue = getAttributeAsNumber(currentElement, END);

    if (endValue > largestEndValue) {
      largestEndValue = endValue;
      largestEndParent = currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return {
    largestBegin: getAttributeAsNumber(largestEndParent, BEGIN),
    largestEnd: getAttributeAsNumber(largestEndParent, END),
  };
};

const isSelectionEmpty = (begin: number, end: number) => {
  return Math.abs(begin - end) === 0;
};

export const checkSelectionBounds = () => {
  const { begin, end, startNode, endNode } = getSelectionIndices(INDEX);

  if (isSelectionEmpty(begin, end)) return { begin, end, isValid: false };

  const startGroup = startNode?.closest('.token-group') as HTMLElement;
  const endGroup = endNode?.closest('.token-group') as HTMLElement;

  if (!startGroup && !endGroup) return { begin, end, isValid: true };
  if (!startGroup || !endGroup) return { begin, end, isValid: false };

  const startId = getAttributeAsNumber(startGroup, ID);
  const endId = getAttributeAsNumber(endGroup, ID);
  const segmentBegin = getAttributeAsNumber(startGroup, BEGIN);
  const segmentEnd = getAttributeAsNumber(endGroup, END);

  if (startId !== endId) {
    if (endGroup.contains(startGroup) && begin <= segmentBegin) {
      return { begin, end, isValid: true };
    }

    if (startGroup.contains(endGroup) && end >= segmentEnd) {
      return { begin, end, isValid: true };
    }

    const { largestBegin, largestEnd } = findLargestBeginEnd(startGroup);
    if (largestBegin !== begin || largestEnd !== end) {
      return { begin, end, isValid: false };
    }
  }

  return { begin, end, isValid: true };
};
