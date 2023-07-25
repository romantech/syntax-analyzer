import React, { Fragment, PropsWithChildren, ReactElement } from 'react';
import { Segment as TSegment } from '@/types/analysis.ts';
import Constituent from '@/components/Constituent';

interface SegmentProps {
  segment: TSegment;
}

export default function Segment({
  segment,
  children,
}: PropsWithChildren<SegmentProps>) {
  if (segment.constituents.length) {
    return segment.constituents.reduce((acc, constituent) => {
      return (
        <Constituent key={constituent.id} constituent={constituent}>
          {acc}
        </Constituent>
      );
    }, children) as ReactElement;
  }
  return <Fragment>{children}</Fragment>;
}
