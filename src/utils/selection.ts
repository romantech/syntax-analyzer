import { getNearestElementByClass } from '@/utils/constituent';
import { ConstituentType } from '@/types/analysis';

const checkValidityByClass = (
  startNode: HTMLElement,
  endNode: HTMLElement,
  className: ConstituentType,
) => {
  const startElement = getNearestElementByClass(startNode, className);
  const endElement = getNearestElementByClass(endNode, className);
  return (
    startElement?.dataset.constituentId === endElement?.dataset.constituentId
  );
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

  const classesToCheck: ConstituentType[] = ['clause', 'phrase', 'token-group'];
  const isValid = classesToCheck.every((className) =>
    checkValidityByClass(startNode, endNode, className),
  );

  const startIndex = startNode.getAttribute(checkAttr);
  const endIndex = endNode.getAttribute(checkAttr);

  begin = startIndex ? parseInt(startIndex, 10) : 0;
  end = endIndex ? parseInt(endIndex, 10) + 1 : 0;

  return { begin, end, isValid };
};
