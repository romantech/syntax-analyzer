const redundantWith = new Map([
  ['direct object', ['object']],
  [
    'complement',
    ['subject complement', 'object complement', 'locative complement'],
  ],
  ['adjectival clause', ['relative clause']],
  [
    'dependent clause',
    ['relative clause', 'adjectival clause', 'noun clause', 'adverbial clause'],
  ],
  ['parallel clause', ['coordinating clause']],
  ['adverbial', ['locative complement']],
  ['adverbial phrase', ['locative complement']],
]);

export const isPunctuationToken = (token: string) =>
  /^[\p{P}\s]+$/u.test(token);

export function filterRedundantSyntaxTags<T extends { label: string }>(
  tags: T[],
  sentence: readonly string[],
  begin: number,
  end: number,
): T[] {
  const labels = new Set(tags.map(({ label }) => label));
  const seen = new Set<string>();

  return tags.filter(({ label }) => {
    if (seen.has(label)) return false;
    seen.add(label);
    if (redundantWith.get(label)?.some((other) => labels.has(other)))
      return false;
    if (label === 'noun phrase' && end - begin === 1) return false;
    if (
      label === 'independent clause' &&
      sentence.slice(0, begin).every(isPunctuationToken) &&
      sentence.slice(end).every(isPunctuationToken)
    ) {
      return false;
    }
    return true;
  });
}
