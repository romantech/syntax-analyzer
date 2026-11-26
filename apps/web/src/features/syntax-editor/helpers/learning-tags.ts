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

export function getLearningSegment(
  segment: TSegment,
  sentence: readonly string[],
  atClauseLevel = true,
): TSegment {
  const { begin, end } = segment;
  const constituents = filterRedundantSyntaxTags(segment.constituents, sentence, begin, end);
  if (atClauseLevel && !constituents.some(({ label }) => overviewRoles.has(label))) {
    const form = constituents.find(({ label }) => legacyAdverbialForms.has(label));
    if (form) {
      // A display-only role uses a distinct ID so the original form can be revealed as a detail.
      constituents.unshift({
        ...ADVERBIAL,
        id: -form.id,
        type: end - begin > 1 ? 'token-group' : 'token',
      });
    }
  }

  const childrenAtClauseLevel =
    constituents.some(({ type }) => type === 'clause') ||
    (atClauseLevel && constituents.every(({ label }) => label === 'verb phrase'));
  return {
    ...segment,
    constituents,
    children: segment.children.map((child) =>
      getLearningSegment(child, sentence, childrenAtClauseLevel),
    ),
  };
}
