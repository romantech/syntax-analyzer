import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_DATA_ATTRS,
} from '@/features/syntax-editor';
import { getSelectionIndices } from '@/base';

const { INDEX, ID, BEGIN, END } = CONSTITUENT_DATA_ATTRS;
const TOKEN_GROUP_SELECTOR = '.' + CONSTITUENT_CLASSES.TOKEN_GROUP;

export const getNumberAttr = (element: HTMLElement, key: string) => {
  return Number(element.getAttribute(key));
};

/** 유효한 선택 범위가 아닐 때 - invalid */
const isSelectionEmpty = (begin: number, end: number) => {
  return Math.abs(begin - end) === 0;
};

/* begin/end 범위내 문장 성분이 없어서 교차할 구/절이 없는 상황일 때 - valid */
const hasNoTokenGroups = (beginGroup: HTMLElement, endGroup: HTMLElement) => {
  return !beginGroup && !endGroup;
};

/** begin/end 범위가 상위 문장 성분 범위와 일치할 때 - valid */
const isSelectionMatchingSegment = (
  begin: number,
  end: number,
  segmentBegin: number,
  segmentEnd: number,
) => {
  return begin === segmentBegin && end === segmentEnd;
};

/**
 * 주어진 요소의 부모 문장 성분들을 탐색하여 가장 큰 target 값 반환
 * 예: 문장 성분의 구조가 [[0, 1], [1, 3]]이며, 부모는 [0, 3], 자식은 [0, 1], [1, 3] 3개가 있다고 가정
 * - [1, 3]을 포함하는 가장 큰 부모는 end(base)가 3인 요소를 상위로 탐색하여 가장 큰 begin(target) 반환
 * - [0, 1]을 포함하는 가장 큰 부모는 begin(base)가 0인 요소를 상위로 탐색하여 가장 큰 end(target) 반환
 */
const computeMaxRange = (
  element: HTMLElement,
  targetAttr: string,
  baseAttr: string,
) => {
  let curElem: HTMLElement | null = element;

  let target = getNumberAttr(element, targetAttr);
  let parentWithTarget = element;
  const base = getNumberAttr(element, baseAttr);

  while (curElem && base === getNumberAttr(curElem, baseAttr)) {
    const currentTarget = getNumberAttr(curElem, targetAttr);

    if (currentTarget !== target) {
      target = currentTarget;
      parentWithTarget = curElem;
    }

    curElem = curElem.parentElement;
  }

  return {
    maxBegin: getNumberAttr(parentWithTarget, BEGIN),
    maxEnd: getNumberAttr(parentWithTarget, END),
  };
};

/**
 * 구/절이 교차하거나 유효하지 않은 선택 범위(begin/end 둘다 0)인지 검사하는 함수
 * e.g. [[0, 2][2, 13]]에서 [1, 4] 범위를 드래그하면 구/절이 교차하므로 유효하지 않음
 * e.g. begin/end 차이가 0이면 유효하지 않은 선택 범위
 * */
export const validateSelectionBounds = () => {
  const { begin, end, startNode, endNode } = getSelectionIndices(INDEX);
  const getReturnValue = (isValid: boolean) => ({ begin, end, isValid });

  // TOKEN_GROUP_SELECTOR 선택자와 일치하는 가장 가까운 조상 요소 탐색
  const beginGroup = startNode?.closest(TOKEN_GROUP_SELECTOR) as HTMLElement;
  const endGroup = endNode?.closest(TOKEN_GROUP_SELECTOR) as HTMLElement;

  if (isSelectionEmpty(begin, end)) return getReturnValue(false);
  if (hasNoTokenGroups(beginGroup, endGroup)) return getReturnValue(true);

  // begin/end 둘 중 하나의 범위에 문장 요소가 없는 상황일 때
  if (!beginGroup || !endGroup) {
    const group = beginGroup ?? endGroup;

    // [(0, 1), [1, 3]] 혹은 [[0, 1], (1, 3)] 2개 케이스 모두 검사
    const resultB = computeMaxRange(group, BEGIN, END);
    const resultE = computeMaxRange(group, END, BEGIN);

    const smallestBegin = Math.min(resultB.maxBegin, resultE.maxBegin);
    const largestEnd = Math.max(resultB.maxEnd, resultE.maxEnd);

    return getReturnValue(begin <= smallestBegin && end >= largestEnd);
  }

  const startId = getNumberAttr(beginGroup, ID);
  const endId = getNumberAttr(endGroup, ID);

  const segmentBegin = getNumberAttr(beginGroup, BEGIN);
  const segmentEnd = getNumberAttr(endGroup, END);

  if (isSelectionMatchingSegment(begin, end, segmentBegin, segmentEnd))
    return getReturnValue(true);

  if (startId !== endId) {
    if (
      (endGroup.contains(beginGroup) && begin <= segmentBegin) ||
      (beginGroup.contains(endGroup) && end >= segmentEnd)
    ) {
      return getReturnValue(true);
    }

    const { maxBegin, maxEnd } = computeMaxRange(beginGroup, BEGIN, END);
    return getReturnValue(maxBegin === begin && maxEnd === end);
  }

  return getReturnValue(beginGroup === endGroup);
};
