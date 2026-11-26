import { Fragment, type ReactNode } from 'react';

import { Constituent, type TSegment } from '@/features/syntax-editor';
import { getOverviewTag } from '../../helpers/learning-tags';
import type { getOverviewDetails } from '../../helpers/overview-details';

export const hasOverviewTags = (segment: TSegment): boolean =>
  !!getOverviewTag(segment) || segment.children.some(hasOverviewTags);

interface Overview {
  details: ReturnType<typeof getOverviewDetails>;
  toggle: (segmentId: number, animate: boolean) => void;
}

interface SegmentListProps {
  segment: TSegment;
  tokenElements: ReactNode[];
  overview?: Overview;
  previouslyVisibleTags?: ReadonlySet<number>;
}

export default function SegmentList({
  segment,
  tokenElements,
  overview,
  previouslyVisibleTags,
}: SegmentListProps) {
  const { id, begin, end } = segment;
  const details = overview?.details.get(id);
  const tags = details?.tags ?? segment.constituents;
  const children = overview
    ? segment.children.filter((child) => overview.details.has(child.id))
    : segment.children;

  const content: ReactNode[] = [];
  for (let index = begin; index < end; index++) {
    const child = children.find(({ begin }) => begin === index);
    if (!child) {
      content.push(tokenElements[index]);
      continue;
    }
    content.push(
      <SegmentList
        key={child.id}
        segment={child}
        tokenElements={tokenElements}
        overview={overview}
        previouslyVisibleTags={previouslyVisibleTags}
      />,
    );
    index = child.end - 1;
  }

  if (!segment.constituents.length) return <Fragment>{content}</Fragment>;
  return (
    <Constituent
      begin={begin}
      end={end}
      tags={tags}
      overviewTagId={details?.role?.id}
      previouslyVisibleTags={previouslyVisibleTags}
      disclosure={
        overview && details?.canExpand
          ? { expanded: details.expanded, toggle: (animate) => overview.toggle(id, animate) }
          : undefined
      }
    >
      {content}
    </Constituent>
  );
}
