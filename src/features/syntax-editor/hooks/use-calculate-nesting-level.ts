import { useBoolean } from '@chakra-ui/react';
import { type RefObject, useEffect } from 'react';

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
  const [isNestingLevelCalculated, setNestingLevelCalculated] = useBoolean();

  useEffect(() => {
    if (isPending || !segment || !targetRef.current) return;

    calculateNestingLevel(targetRef, isTapMode);
    setNestingLevelCalculated.on();
  }, [isPending, segment, setNestingLevelCalculated, targetRef, isTapMode]);

  return isNestingLevelCalculated;
};
