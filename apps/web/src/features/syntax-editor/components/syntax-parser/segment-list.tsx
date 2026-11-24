import { Fragment, type ReactNode } from 'react';

import { Constituent, type TSegment } from '@/features/syntax-editor';

// Keep core clause roles and exposed adverbs visible while nested tags stay collapsed.
const overviewRoles = new Set([1, 2, 3, 4, 5, 6, 8, 9, 26, 31]);
const getOverviewTag = (segment: TSegment) =>
  segment.constituents.find(({ elementId }) => overviewRoles.has(elementId));

export const hasOverviewTags = (segment: TSegment): boolean =>
  !!getOverviewTag(segment) || segment.children.some(hasOverviewTags);

const hasTags = (segment: TSegment): boolean =>
  segment.constituents.length > 0 || segment.children.some(hasTags);

export interface Overview {
  expanded: ReadonlySet<number>;
  entering: number | null;
  toggle: (segmentId: number, animate: boolean) => void;
}

interface SegmentListProps {
  segment: TSegment;
  tokenElements: ReactNode[];
  overview?: Overview;
  showForms?: boolean;
  animateLabels?: boolean;
}

export default function SegmentList({
  segment,
  tokenElements,
  overview,
  showForms = false,
  animateLabels = false,
}: SegmentListProps) {
  const { id, begin, end } = segment;
  const role = overview
    ? (getOverviewTag(segment) ?? (showForms ? segment.constituents[0] : undefined))
    : undefined;
  const isExpanded = !!overview?.expanded.has(id);
  const isEntering = overview?.entering === id;
  const canExpand = !!role && (segment.constituents.length > 1 || segment.children.some(hasTags));

  const tags = !overview
    ? segment.constituents
    : role
      ? [role, ...(isExpanded ? segment.constituents.filter((tag) => tag.id !== role.id) : [])]
      : [];
  const children = role && !isExpanded ? [] : segment.children;

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
        showForms={showForms || isExpanded}
        animateLabels={animateLabels || isEntering}
      />,
    );
    index = child.end - 1;
  }

  if (!tags.length) return <Fragment>{content}</Fragment>;
  return (
    <Constituent
      begin={begin}
      end={end}
      tags={tags}
      overviewTagId={role?.id}
      animateLabels={animateLabels}
      animateExtraLabels={isEntering}
      disclosure={
        overview && canExpand
          ? { expanded: isExpanded, toggle: (animate) => overview.toggle(id, animate) }
          : undefined
      }
    >
      {content}
    </Constituent>
  );
}
