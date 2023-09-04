import { getSelectionIndices } from '@/base';
import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_DATA_ATTRS,
} from '@/features/syntax-editor';

const { INDEX, ID, BEGIN, END } = CONSTITUENT_DATA_ATTRS;
const TOKEN_GROUP_SELECTOR = '.' + CONSTITUENT_CLASSES.TOKEN_GROUP;

export const getNumberAttr = (element: HTMLElement, key: string) => {
  return Number(element.getAttribute(key));
};

/** 유효한 선택 범위인지 확인 */
const isSelectionEmpty = (begin: number, end: number) => {
  return Math.abs(begin - end) === 0;
};

/* 주어진 범위 내 문장 성분이 없는지 확인 */
const hasNoTokenGroups = (beginGroup: HTMLElement, endGroup: HTMLElement) => {
  return !beginGroup && !endGroup;
};

/** 선택한 범위가 상위 문장 성분 범위와 일치하는지 확인 */
const isSelectionMatchingSegment = (
  begin: number,
  end: number,
  segmentBegin: number,
  segmentEnd: number,
) => {
  return begin === segmentBegin && end === segmentEnd;
};

/**
 * 주어진 요소의 상위 문장 성분들 중에서 가장 큰 target 값 반환
 * 예: 문장 성분의 구조가 [[0, 1], [1, 3]]이며, 부모는 [0, 3], 자식은 [0, 1], [1, 3] 이라고 가정,
 * - [0, 1]을 포함하는 begin(base)가 0인 부모 요소를 탐색하여 가장 큰 end(target) 반환
 * - [1, 3]을 포함하는 end(base)가 3인 부모 요소를 탐색하여 가장 큰 begin(target) 반환
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
 * 선택한 범위의 유효성 검사. 유효하지 않은 케이스 예시:
 * 1. 구/절이 교차할 때. 예: [[0, 2], [2, 5]]에서 1~3 범위 선택
 * 2. 시작(begin)과 끝(end)이 동일할 때
 * */
export const validateSelectionBounds = () => {
  const { begin, end, startNode, endNode } = getSelectionIndices(INDEX);
  const getReturnValue = (isValid: boolean) => ({ begin, end, isValid });

  // 선택자와 일치하는 가장 가까운 조상 요소 선택
  const beginGroup = startNode?.closest(TOKEN_GROUP_SELECTOR) as HTMLElement;
  const endGroup = endNode?.closest(TOKEN_GROUP_SELECTOR) as HTMLElement;

  if (isSelectionEmpty(begin, end)) return getReturnValue(false);
  if (hasNoTokenGroups(beginGroup, endGroup)) return getReturnValue(true);

  // begin/end 둘 중 하나의 범위 안에 문장 성분이 없는 경우
  if (!beginGroup || !endGroup) {
    const group = beginGroup ?? endGroup;

    // [0..., [1, 3]] 혹은 [[0, 1], ...3] 2개 케이스 모두 검사
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

  // 공통 부모 안에서 서로 다른 문장 성분을 걸쳐서 선택한 경우
  // 예: 부모 [0, 4], 자식 1 [0, 2], 자식 2 [2, 4] 일 때 자식 1~2 범위 선택
  if (startId !== endId) {
    if (
      // 예: [[0, 1], ...4] 일 때 begin/end 범위가 0~2 이면 [0, 1] 문장 성분을 포함하므로 유효
      (endGroup.contains(beginGroup) && begin <= segmentBegin) ||
      (beginGroup.contains(endGroup) && end >= segmentEnd)
    ) {
      return getReturnValue(true);
    }

    // 선택한 범위가 공통 부모 범위와 일치하는지 확인
    const { maxBegin, maxEnd } = computeMaxRange(beginGroup, BEGIN, END);
    return getReturnValue(maxBegin === begin && maxEnd === end);
  }

  // 선택한 범위 안에 다른 문장 성분이 없는지 확인 (없다면 범위 내에서 자유롭게 태깅 가능)
  return getReturnValue(beginGroup === endGroup);
};
