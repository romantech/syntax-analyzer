import { Constituent, Segment } from '@/types/analysis';
import { generateNumberID } from '@/utils/common.ts';

export const cloneSegment = (segment: Segment) => structuredClone(segment);

const generateSegment = (
  begin: number,
  end: number,
  constituents: Constituent[] = [],
  children: Segment[] = [],
): Segment => ({
  id: generateNumberID(),
  begin,
  end,
  constituents,
  children,
});

export const removeConstituent = (segment: Segment, id: Constituent['id']) => {
  const clonedSegment = cloneSegment(segment);
  const queue: Segment[] = [clonedSegment];
  let found = false;

  while (queue.length > 0) {
    const currentSegment = queue.shift();
    if (!currentSegment) continue;

    const { length: originalLength } = currentSegment.constituents;
    currentSegment.constituents = currentSegment.constituents.filter(
      (constituent) => constituent.id !== id,
    );
    if (originalLength > currentSegment.constituents.length) {
      found = true;
      break;
    }

    if (currentSegment.children.length) {
      queue.push(...currentSegment.children);
    }
  }

  if (!found) console.warn(`No Constituent with id ${id} was found.`);

  return clonedSegment;
};

const addNewSegmentToChild = (child: Segment[], begin: number, end: number) => {
  const newSegment = generateSegment(begin, end);
  child.push(newSegment);
};

export const fillSegment = (
  existingSegment: Segment,
  totalRangeEnd: number,
) => {
  const updatedSegment: Segment = { ...existingSegment };
  const filledChild: Segment[] = [];

  if (updatedSegment.children.length > 0) {
    let trackingBegin = updatedSegment.begin; // 시작 지점 설정

    updatedSegment.children.forEach((childSegment) => {
      // 현재 세그먼트의 begin 지점보다 자식 세그먼트의 begin 지점이 큰 경우
      // 즉, 현재 세그먼트 앞쪽에 빈 구간이 있는지 확인
      // 부모 0~4, 자식 1~2일 때 [0, [1, 2], 3, 4], 0~1이 빈 구간
      if (trackingBegin < childSegment.begin) {
        addNewSegmentToChild(filledChild, trackingBegin, childSegment.begin);
      }

      filledChild.push(childSegment);
      trackingBegin = childSegment.end;
    });

    // 현재 세그먼트의 end 지점이 자식 세그먼트의 end 지점보다 큰 경우
    // 즉, 현재 세그먼트 뒷쪽에 빈 구간이 있는지 확인한다
    // 부모 0~4, 자식 1~2일 때 [0, [1, 2], 3, 4], 2~4가 빈 구간
    if (trackingBegin < updatedSegment.end) {
      addNewSegmentToChild(filledChild, trackingBegin, updatedSegment.end);
    }

    // 현재 세그먼트의 자식에 대해 동일한 처리를 재귀적으로 수행
    updatedSegment.children = filledChild.map((child) =>
      fillSegment(child, updatedSegment.end),
    );
  }

  // filledChild 배열의 마지막 segment.end 값이 totalRangeEnd보다 작다면
  // 즉, 전체 범위 내에서 아직 채우지 않은 공간이 있다면
  // 해당 구간을 채우는 새로운 segment를 생성하고 filledChild 배열에 추가
  const endOfLastFilledSegment =
    filledChild.length > 0 ? filledChild[filledChild.length - 1].end : 0;

  if (endOfLastFilledSegment < totalRangeEnd) {
    addNewSegmentToChild(filledChild, endOfLastFilledSegment, totalRangeEnd);
  }

  return updatedSegment;
};
