import React, { Fragment, PropsWithChildren } from 'react';
import { Segment as TSegment } from '@/types/analysis';
import { Constituent } from '@/components/syntax-parser';

interface SegmentProps {
  segment: TSegment;
  isTokenGroup: boolean;
}

export default function Segment({
  segment,
  children,
  isTokenGroup,
}: PropsWithChildren<SegmentProps>) {
  if (!segment.constituents.length) return <Fragment>{children}</Fragment>;

  return segment.constituents.reduce(
    (tokens, constituent) => (
      <Constituent
        key={constituent.id}
        constituent={constituent}
        isTokenGroup={isTokenGroup}
      >
        {tokens}
      </Constituent>
    ),
    children as JSX.Element,
  );
}
