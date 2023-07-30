import React, { Fragment, PropsWithChildren } from 'react';
import { Segment as TSegment } from '@/types/analysis';
import { Constituent } from '@/components/syntax-parser';
import { isMultipleTokensInRange } from '@/utils/constituent';

interface SegmentProps {
  segment: TSegment;
}

export default function Segment({
  segment,
  children,
}: PropsWithChildren<SegmentProps>) {
  if (!segment.constituents.length) return <Fragment>{children}</Fragment>;
  const isMultipleTokenRange = isMultipleTokensInRange(
    segment.begin,
    segment.end,
  );

  return segment.constituents.reduce(
    (tokens, constituent) => (
      <Constituent
        key={constituent.id}
        constituent={constituent}
        isMultipleTokenRange={isMultipleTokenRange}
      >
        {tokens}
      </Constituent>
    ),
    children as JSX.Element,
  );
}
