import { Nullable } from '@/base';

interface SelectionIndicesResult {
  begin: number;
  end: number;
  startNode: Nullable<HTMLElement>;
  endNode: Nullable<HTMLElement>;
}

export const getSelectionIndices = (
  qualifiedName: string,
): SelectionIndicesResult => {
  let begin = 0;
  let end = 0;

  const sel = window.getSelection();
  if (!sel?.rangeCount) {
    return { begin: 0, end: 0, startNode: null, endNode: null };
  }

  let startNode = sel.getRangeAt(0).startContainer as Node;
  let endNode = sel.getRangeAt(0).endContainer as Node;

  if (startNode.nodeType === Node.TEXT_NODE) startNode = startNode.parentNode!;
  if (endNode.nodeType === Node.TEXT_NODE) endNode = endNode.parentNode!;

  const startElement = startNode as HTMLElement;
  const endElement = endNode as HTMLElement;

  const startIndex = startElement.getAttribute(qualifiedName);
  const endIndex = endElement.getAttribute(qualifiedName);

  begin = startIndex ? Number(startIndex) : 0;
  end = endIndex ? Number(endIndex) + 1 : 0;

  return { begin, end, startNode: startElement, endNode: endElement };
};

export const clearSelection = () => {
  const selection = window.getSelection();
  selection?.removeAllRanges();
};

export const getNearestElementByClass = (
  elementParam: Nullable<HTMLElement>,
  className: string,
) => {
  let element = elementParam;
  while (element) {
    if (element.classList.contains(className)) return element;
    element = element.parentElement;
  }
  return null;
};
