import { Fragment, PropsWithChildren } from 'react';
import {
  Constituent,
  isMultipleTokensInRange,
  TSegment,
} from '@/features/syntax-editor';

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