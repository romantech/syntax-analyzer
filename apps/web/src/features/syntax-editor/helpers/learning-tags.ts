import { ADVERBIAL } from '../../../../../api/src/constants/syntax-constituents.ts';
import { filterRedundantSyntaxTags } from '../../../../../api/src/utils/syntax-tags.ts';
import type { TSegment } from '../types/analysis';

const overviewRoles = new Set([
  'subject',
  'verb',
  'modal verb',
  'perfect auxiliary',
  'progressive auxiliary',
  'passive auxiliary',
  'do-support auxiliary',
  'object',
  'indirect object',
  'direct object',
  'complement',
  'subject complement',
  'object complement',
  'locative complement',
  'adverbial',
]);

const legacyAdverbialForms = new Set(['adverb', 'adverbial phrase', 'adverbial clause']);

export const getOverviewTag = ({ constituents }: TSegment) =>
  constituents.find(({ label }) => overviewRoles.has(label));

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
  const childrenAtClauseLevel =
    isClause || (atClauseLevel && constituents.every(({ label }) => label === 'verb phrase'));
  const childrenInPassiveClause = isClause ? hasPassiveAuxiliary(segment) : passiveClause;
  return {
    ...segment,
    constituents,
    children: segment.children.map((child) =>
      getLearningSegment(child, sentence, childrenAtClauseLevel, childrenInPassiveClause),
    ),
  };
}
