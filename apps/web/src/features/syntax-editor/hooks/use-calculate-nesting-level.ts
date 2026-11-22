import { type RefObject, useEffect, useState } from 'react';

import { calculateNestingLevel, type TSegment } from '@/features/syntax-editor';

interface UseCalculateNestedLevelProps {
  targetRef: RefObject<HTMLElement | null>;
  segment: TSegment | null;
  isPending?: boolean;
  isTapMode?: boolean;
}

export const useCalculateNestingLevel = ({
  targetRef,
  segment,
  isPending = false,
  isTapMode = false,
}: UseCalculateNestedLevelProps) => {
  const [isNestingLevelCalculated, setNestingLevelCalculated] = useState(false);

  useEffect(() => {
    if (isPending || !segment || !targetRef.current) return;

    calculateNestingLevel(targetRef, isTapMode);
    setNestingLevelCalculated(true);
  }, [isPending, segment, targetRef, isTapMode]);

  return isNestingLevelCalculated;
};
