import React, { Fragment, ReactNode } from 'react';
import { Segment as TSegment } from '@/types/analysis.ts';
import Segment from './Segment';

interface SegmentsProps {
  segment: TSegment;
  tokenElements: ReactNode[];
}

export default function Segments({ segment, tokenElements }: SegmentsProps) {
  const childrenWithSegment: ReactNode[] = [];
  const { begin, end } = segment;

  for (let index = begin; index < end; index++) {
    const childSegment = segment.children.find(({ begin }) => begin === index);

    if (childSegment) {
      childrenWithSegment.push(
        <Segments
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
      {childrenWithSegment.map((item, i) => (
        <Fragment key={i}>{item}</Fragment>
      ))}
    </Segment>
  );
}
