import { Constituent, Segment } from '@/types/analysis';

export const cloneSegments = (segments: Segment[]) => structuredClone(segments);

export const removeConstituent = (
  segments: Segment[],
  id: Constituent['id'],
) => {
  const clonedSegments = cloneSegments(segments);
  const queue = [...clonedSegments];
  let found = false;

  while (queue.length > 0) {
    const currentSegment = queue.shift();
    if (!currentSegment) continue;

    const { length: originalLength } = currentSegment.constituents;
    currentSegment.constituents = currentSegment.constituents.filter(
      (constituent) => constituent.id !== id,
    );
    if (originalLength > currentSegment.constituents.length) {
      found = true;
      break;
    }

    if (currentSegment.children.length) {
      queue.push(...currentSegment.children);
    }
  }

  if (!found) console.warn(`No Constituent with id ${id} was found.`);

  return clonedSegments;
};
