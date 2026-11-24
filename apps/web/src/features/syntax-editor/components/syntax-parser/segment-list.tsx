import { Fragment, type ReactNode } from 'react';

import { Constituent, type TSegment } from '@/features/syntax-editor';

// Keep core clause roles visible. Form labels can wrap the whole clause or share a role's range.
const overviewRoles = new Set([1, 2, 3, 4, 5, 6, 8, 9, 26]);
const getOverviewTag = (segment: TSegment) =>
  segment.constituents.find(({ elementId }) => overviewRoles.has(elementId));

export const hasOverviewTags = (segment: TSegment): boolean =>
  !!getOverviewTag(segment) || segment.children.some(hasOverviewTags);

const hasTags = (segment: TSegment): boolean =>
  segment.constituents.length > 0 || segment.children.some(hasTags);

export interface Overview {
  expanded: ReadonlySet<number>;
  toggle: (segmentId: number) => void;
}

interface SegmentListProps {
  segment: TSegment;
  tokenElements: ReactNode[];
  overview?: Overview;
  showForms?: boolean;
}

export default function SegmentList({
  segment,
  tokenElements,
  overview,
  showForms = false,
}: SegmentListProps) {
  const { id, begin, end } = segment;
  const role = overview
    ? (getOverviewTag(segment) ?? (showForms ? segment.constituents[0] : undefined))
    : undefined;
  const isExpanded = !!overview?.expanded.has(id);
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
      disclosure={
        overview && canExpand
          ? { expanded: isExpanded, toggle: () => overview.toggle(id) }
          : undefined
      }
    >
      {content}
    </Constituent>
  );
}
