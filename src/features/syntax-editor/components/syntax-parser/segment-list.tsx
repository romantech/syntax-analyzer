import { ReactNode } from 'react';
import { Segment, TSegment } from '@/features/syntax-editor';

interface SegmentsProps {
  segment: TSegment;
  tokenElements: ReactNode[];
}

export default function SegmentList({ segment, tokenElements }: SegmentsProps) {
  const childrenWithSegment: ReactNode[] = [];
  const { begin, end } = segment;

  for (let index = begin; index < end; index++) {
    const childSegment = segment.children.find(({ begin }) => begin === index);

    if (childSegment) {
      childrenWithSegment.push(
        <SegmentList
          segment={childSegment}
          tokenElements={tokenElements}
          key={childSegment.id}
        />,
      );
      index = childSegment.end - 1; // 자식 파트가 끝나는 지점 이후부터 시작하도록 인덱스 조정
    } else {
      childrenWithSegment.push(tokenElements[index]);
    }
  }

  return (
    <Segment segment={segment}>
      {childrenWithSegment.map((token) => token)}
    </Segment>
  );
}

/**
 * 렌더링 시뮬레이션
 * ['I', 'am', 'a', 'boy', 'who', 'likes', 'to', 'play', 'tennis', '.']
 * segment1 : 0, 2 (I am)
 * segment2 : 2, 10 (a boy who likes to play tennis.)
 * segment2.child[0] : 2, 4 (a boy)
 * segment2.child[1] : 4, 10 (who likes to play tennis.)
 * -----------------------------------------------------------------------------
 * i0 found child -> segment1 재귀 호출
 * -----------------------------------------------------------------------------
 * <segment1.begin = 0>
 * i0 not found child -> ['I']
 * i1 not found child -> ['I', 'am']
 * return ['I', 'am'] -> <Segment1>
 * -----------------------------------------------------------------------------
 * back to root : childrenWithSegment = [<Segment1>]
 * index : segment1.end - 1 + 1 = 2
 * i2 found child -> segment2 재귀 호출
 * -----------------------------------------------------------------------------
 * <segment2.begin = 2>
 * i2 found child -> segment2.child[0] 재귀 호출
 * -----------------------------------------------------------------------------
 * <segment2.child[0].begin 2>
 * i2 not found child -> ['a']
 * i3 not found child -> ['a', 'boy']
 * return ['a', 'boy'] -> <Segment2.child[0]>
 * -------------------------------------------------
 * back to segment2 : childrenWithSegment = [<Segment2.child[0]>]
 * index : segment2.child[0].end - 1 + 1 = 4
 * i4 found child -> segment2.child[1] 재귀 호출
 * -----------------------------------------------------------------------------
 * <segment2.child[1].begin = 4>
 * i4 not found child -> ['who']
 * ...생략
 * i9 not found child -> ['who', 'likes', 'to', 'play', 'tennis', '.']
 * return ['who', 'likes', 'to', 'play', 'tennis', '.'] -> <Segment2.child[1]>
 * -----------------------------------------------------------------------------
 * back to segment2 : childrenWithSegment = [<Segment2.child[0]>, <Segment2.child[1]>]
 * return ['a', 'boy', 'who', 'likes', ..., '.'] -> <Segment2>
 * -----------------------------------------------------------------------------
 * back to root : childrenWithSegment = [<Segment1>, <Segment2>]
 * return ['I', 'am', 'a', 'boy', 'who', 'likes', ..., '.'] -> <Segments>
 * */
