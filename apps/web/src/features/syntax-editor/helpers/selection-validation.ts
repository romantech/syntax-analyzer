import type { TSegment } from '../types/analysis';

export const getNumberAttr = (element: HTMLElement, key: string) => {
  return Number(element.getAttribute(key));
};

/** 드래그와 탭 모두 기존 구/절의 포함은 허용하고 교차는 거부한다. */
export const validateSelectionBounds = (segment: TSegment, begin: number, end: number): boolean => {
  if (
    !Number.isInteger(begin) ||
    !Number.isInteger(end) ||
    begin < segment.begin ||
    end > segment.end ||
    begin >= end
  ) {
    return false;
  }

  const hasCrossing = (current: TSegment): boolean => {
    const overlaps = begin < current.end && end > current.begin;
    if (!overlaps) return false;

    const contains = begin <= current.begin && end >= current.end;
    const isInside = begin >= current.begin && end <= current.end;
    if (current.constituents.length && !contains && !isInside) return true;

    return current.children.some(hasCrossing);
  };

  return !hasCrossing(segment);
};
