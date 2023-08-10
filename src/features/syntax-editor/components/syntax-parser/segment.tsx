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

  const { begin, end } = segment;
  const isMultipleTokenRange = isMultipleTokensInRange(begin, end);

  return segment.constituents.reduce(
    (tokens, constituent) => (
      <Constituent
        key={constituent.id}
        begin={begin}
        end={end}
        constituent={constituent}
        isMultipleTokenRange={isMultipleTokenRange}
      >
        {tokens}
      </Constituent>
    ),
    children as JSX.Element,
  );
}
