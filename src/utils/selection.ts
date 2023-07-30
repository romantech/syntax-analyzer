import { Nullable } from '@/types/common';

export const getNearestElementByClass = (
  elementParam: Nullable<HTMLElement>,
  className: string = 'constituent',
) => {
  let element = elementParam;
  while (element) {
    if (element.classList.contains(className)) return element;
    element = element.parentElement;
  }
  return null;
};

export const getBeginEndIdxFromSelection = (
  checkAttr: string = 'data-token-index',
) => {
  let begin = 0;
  let end = 0;

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return { begin, end };

  const range = sel.getRangeAt(0);
  const startNode = range.startContainer.parentNode as HTMLElement;
  const endNode = range.endContainer.parentNode as HTMLElement;

  const startIndex = startNode.getAttribute(checkAttr);
  const endIndex = endNode.getAttribute(checkAttr);

  begin = startIndex ? parseInt(startIndex, 10) : 0;
  end = endIndex ? parseInt(endIndex, 10) + 1 : 0;

  return { begin, end };
};
