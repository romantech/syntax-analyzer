import { ADVERBIAL, CONJUNCTION } from 'syntax-analyzer-shared/syntax-constituents.js';
import { filterRedundantSyntaxTags } from 'syntax-analyzer-shared/syntax-tags.js';
import type { TSegment } from '../types/analysis';

const auxiliaryRoles = new Set([
  'modal verb',
  'perfect auxiliary',
  'progressive auxiliary',
  'passive auxiliary',
  'do-support auxiliary',
]);

const overviewRoles = new Set([
  'subject',
  'verb',
  ...auxiliaryRoles,
  'object',
  'indirect object',
  'direct object',
  'complement',
  'subject complement',
  'object complement',
  'locative complement',
  'adverbial',
  'conjunction',
]);

const legacyAdverbialForms = new Set(['adverb', 'adverbial phrase', 'adverbial clause']);

export const getOverviewTag = ({ constituents }: TSegment) =>
  constituents.find(({ label }) => overviewRoles.has(label));

export const isOverviewAuxiliary = (tag: ReturnType<typeof getOverviewTag>) =>
  tag !== undefined && auxiliaryRoles.has(tag.label);

export const childrenAreAtClauseLevel = (
  constituents: TSegment['constituents'],
  atClauseLevel: boolean,
) =>
  constituents.some(({ type }) => type === 'clause') ||
  (atClauseLevel && constituents.every(({ label }) => label === 'verb phrase'));

const hasPassiveAuxiliary = (segment: TSegment): boolean =>
  segment.constituents.some(({ label }) => label === 'passive auxiliary') ||
  segment.children.some(
    (child) =>
      !child.constituents.some(({ type }) => type === 'clause') && hasPassiveAuxiliary(child),
  );

export function getLearningSegment(
  segment: TSegment,
  sentence: readonly string[],
  atClauseLevel = true,
  passiveClause = hasPassiveAuxiliary(segment),
): TSegment {
  const { begin, end } = segment;
  const constituents = filterRedundantSyntaxTags(segment.constituents, sentence, begin, end);
  if (atClauseLevel && !constituents.some(({ label }) => overviewRoles.has(label))) {
    const form = constituents.find(
      ({ label }) =>
        legacyAdverbialForms.has(label) ||
        (passiveClause &&
          label === 'prepositional phrase' &&
          sentence[begin]?.toLowerCase() === 'by'),
    );
    if (form) {
      // A display-only role uses a distinct ID so the original form can be revealed as a detail.
      constituents.unshift({
        ...ADVERBIAL,
        id: -form.id,
        type: end - begin > 1 ? 'token-group' : 'token',
      });
    }
  }

  const isClause = constituents.some(({ type }) => type === 'clause');
  const childrenAtClauseLevel = childrenAreAtClauseLevel(constituents, atClauseLevel);
  const childrenInPassiveClause = isClause ? hasPassiveAuxiliary(segment) : passiveClause;
  const children = segment.children.map((child) =>
    getLearningSegment(child, sentence, childrenAtClauseLevel, childrenInPassiveClause),
  );
  const [first, second] = children;
  // A separate subject after a bare "that" distinguishes the clause marker from "that book".
  if (
    sentence[begin]?.toLowerCase() === 'that' &&
    constituents.some(({ label }) => label === 'noun clause') &&
    first?.begin === begin &&
    first.end === begin + 1 &&
    first.constituents.length === 0 &&
    first.children.length === 0 &&
    second?.begin === first.end &&
    second.constituents.some(({ label }) => label === 'subject')
  ) {
    children[0] = { ...first, constituents: [{ ...CONJUNCTION, id: -first.id }] };
  }

  return {
    ...segment,
    constituents,
    children,
  };
}
