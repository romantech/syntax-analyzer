import { Fragment, type ReactNode } from 'react';

import { Constituent, type TSegment } from '@/features/syntax-editor';
import { getOverviewTag } from '@/features/syntax-editor/helpers/learning-tags';
import type { getOverviewDetails } from '@/features/syntax-editor/helpers/overview-details';
import type { TagDescriptionMode } from './constituent';

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
  overviewBaseline?: Overview['details'];
  previouslyVisibleTags?: ReadonlySet<number>;
  descriptionMode?: TagDescriptionMode;
}

export default function SegmentList({
  segment,
  tokenElements,
  overview,
  overviewBaseline,
  previouslyVisibleTags,
  descriptionMode,
}: SegmentListProps) {
  const { id, begin, end } = segment;
  const details = overview?.details.get(id);
  const baseline = overviewBaseline?.get(id);
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
        overviewBaseline={overviewBaseline}
        previouslyVisibleTags={previouslyVisibleTags}
        descriptionMode={descriptionMode}
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
      detailOnly={!!overviewBaseline && (!baseline || baseline.detailOnly)}
      baselineRoleId={baseline?.role?.id}
      baselineDisclosure={baseline?.canExpand && !details?.canExpand}
      overviewTagId={details?.role?.id}
      previouslyVisibleTags={previouslyVisibleTags}
      descriptionMode={descriptionMode}
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
