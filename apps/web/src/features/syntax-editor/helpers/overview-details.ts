import type { TSegment } from '../types/analysis';
import type { TConstituent } from '../types/constituent';
import { getOverviewTag } from './learning-tags.ts';

interface SegmentDetails {
  tags: TConstituent[];
  role?: TConstituent;
  expanded: boolean;
  canExpand: boolean;
}

const hasTags = (segment: TSegment): boolean =>
  segment.constituents.length > 0 || segment.children.some(hasTags);

export function getOverviewDetails(segment: TSegment, expanded: ReadonlySet<number>) {
  const details = new Map<number, SegmentDetails>();

  function visit(segment: TSegment, showForms: boolean, hasAncestorDetails: boolean): boolean {
    const { id, constituents, children } = segment;
    const role = getOverviewTag(segment) ?? (showForms ? constituents[0] : undefined);
    const otherTags = constituents.filter((tag) => tag !== role);
    const contextTags = otherTags.filter(({ type }) => type === 'phrase' || type === 'clause');
    const canExpand =
      !!role && (hasAncestorDetails || otherTags.length > 0 || children.some(hasTags));
    const isExpanded = canExpand && expanded.has(id);

    let hasExpandedDescendant = false;
    if (!role || isExpanded) {
      // An expanded parent already reveals the context it shares with every child.
      const childHasAncestorDetails = !isExpanded && (hasAncestorDetails || contextTags.length > 0);
      for (const child of children) {
        if (visit(child, showForms || isExpanded, childHasAncestorDetails)) {
          hasExpandedDescendant = true;
        }
      }
    }

    const visibleDetails = isExpanded ? otherTags : hasExpandedDescendant ? contextTags : [];
    details.set(id, {
      tags: role ? [role, ...visibleDetails] : visibleDetails,
      role,
      expanded: isExpanded,
      canExpand,
    });
    return isExpanded || hasExpandedDescendant;
  }

  visit(segment, false, false);
  return details;
}
