import React, { Fragment, PropsWithChildren } from 'react';
import { Segment as TSegment } from '@/types/analysis';
import { Constituent } from '@/components/syntax-parser';

interface SegmentProps {
  segment: TSegment;
  isMultipleWords: boolean;
}

export default function Segment({
  segment,
  children,
  isMultipleWords,
}: PropsWithChildren<SegmentProps>) {
  if (!segment.constituents.length) return <Fragment>{children}</Fragment>;

  return segment.constituents.reduce(
    (tokens, constituent) => (
      <Constituent
        key={constituent.id}
        constituent={constituent}
        isTokenGroup={isMultipleWords && constituent.type === 'token'}
      >
        {tokens}
      </Constituent>
    ),
    children as JSX.Element,
  );
}
