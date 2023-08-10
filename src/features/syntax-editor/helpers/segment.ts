import { generateNumberID, Nullable } from '@/base';
import { TConstituent, TSegment } from '@/features/syntax-editor';

export const cloneSegment = (segment: TSegment) => structuredClone(segment);

const generateSegment = (
  begin: number,
  end: number,
  constituents: TConstituent[] = [],
  children: TSegment[] = [],
): TSegment => ({
  id: generateNumberID(),
  begin,
  end,
  constituents,
  children,
});

const isSegmentMatchingRange = (
  segment: TSegment,
  begin: number,
  end: number,
) => {
  return segment.begin === begin && segment.end === end;
};

const isRangeWithinSegment = (segment: TSegment, begin: number, end: number) =>
  segment.begin <= begin && segment.end >= end;

const isSegmentWithinRange = (segment: TSegment, begin: number, end: number) =>
  segment.begin >= begin && segment.end <= end;

/**
 * - begin/end 범위 보다 작은 세그먼트를 필터링해서 반환하는 함수
 * - 세그먼트의 자식까지 모두 검사하며, flatMap 메서드를 사용해서 1차원 배열로 반환
 * */
const filterSegmentsWithinRange = (
  childSegments: TSegment[],
  begin: number,
  end: number,
): TSegment[] => {
  // flatMap 메서드는 1뎁스까지 배열을 펼치고, 빈 배열을 반환하면 결과에 포함하지 않음
  return childSegments.flatMap((segment) => {
    if (isSegmentWithinRange(segment, begin, end)) {
      return [segment];
    } else {
      return filterSegmentsWithinRange(segment.children, begin, end);
    }
  });
};

/**
 * - begin/end 범위와 일치하는 세그먼트에 있는 문장 성분을 'pluck' 하는 함수
 * - 범위에 해당하는 세그먼트를 찾으면, 해당 세그먼트의 문장 성분을 추출하고,
 * - 추출한 문장 성분은 원래 세그먼트에서 제거됨.
 * - 이 과정을 반복하며 추출한 문장 성분들을 배열로 반환함
 * - 참고로 'pluck' 단어는 얻어내고 제거한다는 두 가지 의미를 모두 포함하고 있음
 * */
const pluckConstituentsInRange = (
  childSegments: TSegment[],
  begin: number,
  end: number,
): TConstituent[] => {
  return childSegments.flatMap((child) => {
    if (isSegmentMatchingRange(child, begin, end)) {
      const cloned = [...child.constituents];
      child.constituents = [];
      return cloned;
    } else return pluckConstituentsInRange(child.children, begin, end);
  });
};

const generateAndConfigureSegment = (
  childSegments: TSegment[],
  begin: number,
  end: number,
): TSegment => {
  const segment = generateSegment(begin, end);
  segment.constituents = pluckConstituentsInRange(
    childSegments,
    segment.begin,
    segment.end,
  );
  segment.children = filterSegmentsWithinRange(
    childSegments,
    segment.begin,
    segment.end,
  );
  return segment;
};

/**
 * - 주어진 범위(begin/end)에 해당하는 세그먼트에 새로운 Constituent 를 추가하는 함수
 * - 아래 4가지 케이스를 고려하여 Constituent 를 추가함
 * 1. begin-end 범위가 현재 세그먼트 범위와 일치할 때: 해당 세그먼트에 추가
 * 2. begin-end 범위가 현재 세그먼트 범위보다 작을 때 : 자식 세그먼트 중 해당 범위를 포함하는 세그먼트를 찾아서 추가
 * 3. 자식 세그먼트가 없을 때: 새로운 세그먼트를 생성하고, 해당 세그먼트에 추가
 * 4. begin-end 범위를 포함하는 자식 세그먼트가 없을 때 : 자식 세그먼트를 결합하여 새로운 세그먼트를 생성하고, 해당 세그먼트에 추가
 *
 *  @param {TSegment} segment - Constituent 추가할 대상 세그먼트
 *  @param {number} begin - 범위의 시작 값
 *  @param {number} end - 범위의 종료 값
 *  @param {TConstituent} constituent - 추가할 Constituent
 *  @returns {TSegment} Constituent 추가된 후의 세그먼트
 */
export const addConstituent = (
  segment: TSegment,
  begin: number,
  end: number,
  constituent: TConstituent,
): TSegment => {
  const clonedSegment: TSegment = cloneSegment(segment);

  // Case 1: begin-end 범위가 현재 세그먼트 범위와 일치할 때
  if (isSegmentMatchingRange(clonedSegment, begin, end)) {
    clonedSegment.constituents.push(constituent);
    return clonedSegment;
  }

  // Case 2: begin-end 범위가 현재 세그먼트 범위보다 작을 때
  if (isRangeWithinSegment(clonedSegment, begin, end)) {
    const index = clonedSegment.children.findIndex((child) =>
      isRangeWithinSegment(child, begin, end),
    );

    if (index !== -1) {
      clonedSegment.children[index] = addConstituent(
        clonedSegment.children[index],
        begin,
        end,
        constituent,
      );
      return clonedSegment;
    }
  }

  // Case 3: 자식 세그먼트가 1개도 없을 때
  if (clonedSegment.children.length === 0) {
    const newSegment = generateSegment(begin, end, [constituent]);
    clonedSegment.children.push(newSegment);
    return clonedSegment;
  }

  /**
   * <Case 4: begin-end 범위를 포함하는 자식 세그먼트가 없을 때>
   *
   * <Case 4-1: left/middle 세그먼트로 재구성>
   * 자식 세그먼트 중 begin 혹은 end 와 일치해서 이를 조합하면 begin-end 범위를 포함할 수 있을 때
   * e.g. begin 0, end 7일 때, 자식 세그먼트가 [(0), 2], [2, (7)] 이라면 [(0), (7)]로 조합하여 포함 가능
   * 자식 세그먼트 [begin, end] : [[0, 2], [2, 7], [7, 13]]
   * 추가 세그먼트 [begin ,end] : [0, 7]
   * 재구성 세그먼트 [[left], [right]] : [[0, 7], [7, 13]]
   *
   * <Case 4-2: left/middle/right 세그먼트로 재구성>
   * 자식 세그먼트 중 begin 혹은 end 와 일치하는 세그먼트가 하나도 없을 때 -> 조합 불가
   * 자식 세그먼트 [begin, end] : [[0, 3], [3, 6], [6, 13]]
   * 추가 세그먼트 [begin ,end] : [2, 7]
   * 재구성 세그먼트 [[left], [middle], [right]] : [[0, 2], [2, 7], [7, 13]]
   *
   * <세그먼트를 재구성한 후 아래 작업 수행>
   * 1. left/middle/right 범위와 일치하는 문장 성분을 찾아서 추출(pluck)
   * 2. left/middle/right 범위에 속하는 세그먼트를 찾아서 자식으로 이동
   * */
  let left: Nullable<TSegment> = null;
  let middle: Nullable<TSegment> = null;
  let right: Nullable<TSegment> = null;

  const firstChildBegin = clonedSegment.children.at(0)!.begin;
  const lastChildEnd = clonedSegment.children.at(-1)!.end;
  /**
   * begin(0) === firstChildBegin(0) 참이면 case 4-1 이므로 end 값을 leftEnd 로 설정
   * begin(2) !== firstChildBegin(0) 참이면 case 4-2 이므로 begin 값을 leftEnd 로 설정
   * */
  const leftEnd = begin === firstChildBegin ? end : begin;
  left = generateAndConfigureSegment(
    clonedSegment.children,
    firstChildBegin,
    leftEnd,
  );

  // left.begin === begin && left.end === end 참이면 case 4-1 이므로 middle 생성 안함
  if (!isSegmentMatchingRange(left, begin, end)) {
    middle = generateAndConfigureSegment(clonedSegment.children, begin, end);
  }

  right = generateAndConfigureSegment(
    clonedSegment.children,
    end,
    lastChildEnd,
  );

  /**
   * 타입 가드는 런타임시 특정 타입이 보장되는지 확인할 때 사용
   * 즉, filter 함수 결과의 요소는 TSegment 타입만 남긴다는 것을 TS 컴파일러에게 알려줌 */
  clonedSegment.children = [left, middle, right].filter(
    (segment): segment is TSegment => Boolean(segment),
  );

  clonedSegment.children.forEach((child) => {
    if (isSegmentMatchingRange(child, begin, end)) {
      child.constituents.push(constituent);
    }
  });

  return clonedSegment;
};

/**
 * - 입력받은 constituent.id를 찾아 삭제하는 함수
 * - 현재 레벨의 세그먼트에서 찾지 못하면,
 * - 다음 레벨을 탐색하는 너비 우선 탐색 방식 사용
 * */
export const removeConstituent = (
  segment: TSegment,
  id: TConstituent['id'],
) => {
  const clonedSegment = cloneSegment(segment);
  const queue: TSegment[] = [clonedSegment];
  let found = false;

  while (queue.length > 0) {
    const currentSegment = queue.shift();
    if (!currentSegment) continue;

    // filter 후의 배열 길이와 비교하기 위해 원본 배열 길이 임시 저장
    const { length: originalLength } = currentSegment.constituents;
    // constituent.id를 찾으면 constituents 배열에서 제외
    currentSegment.constituents = currentSegment.constituents.filter(
      (constituent) => constituent.id !== id,
    );
    // originalLength 길이가 더 크면 constituent.id를 찾아 삭제했으므로 함수 종료
    if (originalLength > currentSegment.constituents.length) {
      found = true;
      break;
    }

    // 현재 레벨의 세그먼트에서 찾지 못하면 큐에 추가한 후 위 과정 반복
    if (currentSegment.children.length) {
      queue.push(...currentSegment.children);
    }
  }

  if (!found) console.warn(`No Constituent with id ${id} was found.`);

  return clonedSegment;
};

const addNewSegmentToChild = (
  child: TSegment[],
  begin: number,
  end: number,
) => {
  const newSegment = generateSegment(begin, end);
  child.push(newSegment);
};

/**
 * - 트리 구조의 세그먼트를 깊이 우선 방식으로 탐색하고,
 * - 빈 구간이 있으면 새로운 세그먼트를 생성하여 추가하는 함수
 * - e.g. 부모 세그먼트 begin 0, end 4 / 자식 세그먼트 begin 1, end 2
 * - [[1, 2]] -> [[0, 1], [1, 2], [2, 4]]
 * */
export const fillSegment = (
  existingSegment: TSegment,
  totalRangeEnd: number,
) => {
  const updatedSegment: TSegment = { ...existingSegment };
  const filledChild: TSegment[] = [];

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
      trackingBegin = childSegment.end; // 시작 지점 업데이트
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

  const endOfLastFilledSegment =
    filledChild.length > 0 ? filledChild[filledChild.length - 1].end : 0;

  // filledChild 배열의 마지막 segment.end 값이 totalRangeEnd 보다 작다면
  // 즉, 전체 범위 내에서 아직 채우지 않은 공간이 있다면
  // 해당 구간을 채우는 새로운 세그먼트를 생성하고 filledChild 배열에 추가
  if (endOfLastFilledSegment < totalRangeEnd) {
    addNewSegmentToChild(filledChild, endOfLastFilledSegment, totalRangeEnd);
  }

  return updatedSegment;
};

export const removeEmptySegment = (segment: TSegment): TSegment => {
  segment.children = segment.children
    .map(removeEmptySegment) // DFS
    .filter(({ constituents, children }) => {
      // 자식 혹은 문법 요소가 1개라도 있으면 비어있지 않은 세그먼트로 간주
      return constituents.length || children.length;
    });

  return segment;
};
