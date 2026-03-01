import { Nullable } from '@/base';

interface SelectionIndicesResult {
  begin: number;
  end: number;
  startNode: Nullable<HTMLElement>;
  endNode: Nullable<HTMLElement>;
}

/**
 * Retrieves the selection indices and nodes within a specified qualified name.
 *
 * @param {string} qualifiedName - The qualified name to search for in the HTML elements.
 * @return {SelectionIndicesResult} - An object containing the beginning and ending indices of the selection, as well as the start and end nodes.
 */
export const getSelectionIndices = (
  qualifiedName: string,
): SelectionIndicesResult => {
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

  const begin = startIndex ? Number(startIndex) : 0;
  const end = endIndex ? Number(endIndex) + 1 : 0;

  return { begin, end, startNode: startElement, endNode: endElement };
};

/**
 * Clears the current selection in the window.
 *
 * @return {void} No return value.
 */
export const clearSelection = (): void => {
  const selection = window.getSelection();
  selection?.removeAllRanges();
};

/**
 * Finds and returns the nearest element with the specified class name.
 *
 * @param {Nullable<HTMLElement>} elementParam - The starting element to search from.
 * @param {string} className - The class name to search for.
 * @return {Nullable<HTMLElement>} - The nearest element with the specified class name, or null if not found.
 */
export const getNearestElementByClass = (
  elementParam: Nullable<HTMLElement>,
  className: string,
): Nullable<HTMLElement> => {
  let element = elementParam;
  while (element) {
    if (element.classList.contains(className)) return element;
    element = element.parentElement;
  }
  return null;
};
