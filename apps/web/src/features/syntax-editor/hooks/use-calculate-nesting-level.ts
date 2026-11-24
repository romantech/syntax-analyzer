import { type RefObject, useLayoutEffect } from 'react';

import { calculateNestingLevel, type TSegment } from '@/features/syntax-editor';

interface UseCalculateNestedLevelProps {
  targetRef: RefObject<HTMLElement | null>;
  segment: TSegment;
  isTapMode: boolean;
  overviewDetails: ReadonlySet<number> | undefined;
}

export const useCalculateNestingLevel = ({
  targetRef,
  segment,
  isTapMode,
  overviewDetails,
}: UseCalculateNestedLevelProps) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: segment and overviewDetails change the rendered tags.
  useLayoutEffect(() => {
    calculateNestingLevel(targetRef, isTapMode);
  }, [segment, overviewDetails, targetRef, isTapMode]);
};
