import type { TSegment } from '../types/analysis';
import type { TConstituent } from '../types/constituent';
import { childrenAreAtClauseLevel, getOverviewTag, isOverviewAuxiliary } from './learning-tags.ts';

interface SegmentDetails {
  tags: TConstituent[];
  role?: TConstituent;
  expanded: boolean;
  canExpand: boolean;
  detailOnly: boolean;
}

const hasTags = (segment: TSegment): boolean =>
  segment.constituents.length > 0 || segment.children.some(hasTags);

const collapsedState = new Set<number>();
const suppressedByAnalysis = new WeakMap<TSegment, ReadonlySet<number>>();

export function toggleOverviewExpansion(toggled: ReadonlySet<number>, id: number) {
  const next = new Set(toggled);
  if (!next.delete(id)) next.add(id);
  return next;
}

function visibleTagIds(details: ReadonlyMap<number, SegmentDetails>) {
  return new Set([...details.values()].flatMap(({ tags }) => tags.map(({ id }) => id)));
}

export function getOverviewDetails(
  segment: TSegment,
  toggled: ReadonlySet<number>,
  expandAll = false,
) {
  let suppressed = suppressedByAnalysis.get(segment);
  if (!suppressed) {
    suppressed = findRedundantDisclosures(segment);
    suppressedByAnalysis.set(segment, suppressed);
  }
  const details = projectOverview(segment, toggled, suppressed, expandAll);
  if (!expandAll && !toggled.size) return details;

  // A shared tag can already be visible through another disclosure.
  const visible = visibleTagIds(details);
  for (const [id, detail] of details) {
    if (!detail.canExpand) continue;
    const next = visibleTagIds(
      projectOverview(segment, toggleOverviewExpansion(toggled, id), suppressed, expandAll),
    );
    detail.canExpand = visible.size !== next.size || [...next].some((tagId) => !visible.has(tagId));
  }
  return details;
}

function findRedundantDisclosures(segment: TSegment) {
  const baseline = projectOverview(segment, collapsedState);
  const visibleTags = visibleTagIds(baseline);
  const startBySegment = new Map<number, number>();

  // Visit in sentence order so the first eligible label wins when there is no clause introducer.
  function collectStarts(segment: TSegment) {
    if (!baseline.has(segment.id)) return;
    startBySegment.set(segment.id, segment.begin);
    segment.children.forEach(collectStarts);
  }
  collectStarts(segment);

  const representative = new Map<string, { id: number; introducesClause: boolean }>();
  const suppressed = new Set<number>();
  for (const [id, begin] of startBySegment) {
    const detail = baseline.get(id);
    if (!detail?.canExpand) continue;
    const preview = projectOverview(segment, new Set([id]));
    const added: number[] = [];
    let introducesClause = false;
    for (const [contextId, { tags }] of preview) {
      for (const tag of tags) {
        if (visibleTags.has(tag.id)) continue;
        added.push(tag.id);
        if (
          detail.role?.label === 'conjunction' &&
          tag.type === 'clause' &&
          startBySegment.get(contextId) === begin
        ) {
          introducesClause = true;
        }
      }
    }
    if (!added.length) {
      suppressed.add(id);
      continue;
    }

    const key = added.sort((a, b) => a - b).join(',');
    const existing = representative.get(key);
    if (!existing || (introducesClause && !existing.introducesClause)) {
      if (existing) suppressed.add(existing.id);
      representative.set(key, { id, introducesClause });
    } else {
      suppressed.add(id);
    }
  }
  return suppressed;
}

function projectOverview(
  segment: TSegment,
  toggled: ReadonlySet<number>,
  suppressed?: ReadonlySet<number>,
  expandAll = false,
) {
  const details = new Map<number, SegmentDetails>();

  function visit(
    segment: TSegment,
    showForms: boolean,
    hasAncestorDetails: boolean,
    atClauseLevel: boolean,
    showAll: boolean,
  ): { expanded: boolean; collapsed: boolean } {
    const { id, constituents, children } = segment;
    const role =
      getOverviewTag(segment) ??
      (showForms ? constituents[0] : undefined) ??
      constituents.find(({ label }) => atClauseLevel && label === 'prepositional phrase');
    const otherTags = constituents.filter((tag) => tag !== role);
    const contextTags = otherTags.filter(({ type }) => type === 'phrase' || type === 'clause');
    const canExpand =
      !!role &&
      !suppressed?.has(id) &&
      (hasAncestorDetails || otherTags.length > 0 || children.some(hasTags));
    const isToggled = toggled.has(id);
    const isCollapsed = showAll && canExpand && isToggled;
    const showAllHere = showAll && !isCollapsed;
    const isExpanded = canExpand && (expandAll ? showAllHere : isToggled);

    let hasExpandedDescendant = false;
    let hasCollapsedDescendant = false;
    if (showAllHere || !role || isExpanded) {
      // An expanded parent already reveals the context it shares with every child.
      const childHasAncestorDetails = !isExpanded && (hasAncestorDetails || contextTags.length > 0);
      const childrenAtClauseLevel = childrenAreAtClauseLevel(constituents, atClauseLevel);
      for (const child of children) {
        const childState = visit(
          child,
          showForms || isExpanded,
          childHasAncestorDetails,
          childrenAtClauseLevel,
          showAllHere,
        );
        hasExpandedDescendant ||= childState.expanded;
        hasCollapsedDescendant ||= childState.collapsed;
      }
    } else if (role.label === 'verb') {
      for (const child of children) {
        if (isOverviewAuxiliary(getOverviewTag(child)))
          visit(child, showForms, false, false, false);
      }
    } else {
      const introducer = children[0];
      if (
        introducer?.begin === segment.begin &&
        introducer.end === segment.begin + 1 &&
        getOverviewTag(introducer)?.label === 'conjunction' &&
        constituents.some(({ label }) => label === 'noun clause')
      ) {
        visit(introducer, false, false, true, false);
      }
    }

    const visibleDetails = isExpanded ? otherTags : hasExpandedDescendant ? contextTags : [];
    // Keep shared context until the last disclosure that reveals it is closed.
    const hideSharedContext = !role && hasCollapsedDescendant && !hasExpandedDescendant;
    const fullTags = hideSharedContext
      ? constituents.filter((tag) => !contextTags.includes(tag))
      : constituents;
    details.set(id, {
      tags: showAllHere ? fullTags : role ? [role, ...visibleDetails] : visibleDetails,
      role,
      expanded: isExpanded,
      canExpand,
      detailOnly: showForms || !role,
    });
    return {
      expanded: isExpanded || hasExpandedDescendant,
      collapsed: isCollapsed || (!role && hasCollapsedDescendant),
    };
  }

  visit(segment, false, false, true, expandAll);
  return details;
}
