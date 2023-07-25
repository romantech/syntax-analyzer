import React, { Fragment, PropsWithChildren } from 'react';
import { Segment as TSegment } from '@/types/analysis.ts';
import Constituent from '@/components/Constituent';

interface SegmentProps {
  segment: TSegment;
}

export default function Segment({
  segment,
  children,
}: PropsWithChildren<SegmentProps>) {
  if (!segment.constituents.length) return <Fragment>{children}</Fragment>;

  return segment.constituents.reduce(
    (nestedElements, constituent) => (
      <Constituent key={constituent.id} constituent={constituent}>
        {nestedElements}
      </Constituent>
    ),
    children,
  );
}
