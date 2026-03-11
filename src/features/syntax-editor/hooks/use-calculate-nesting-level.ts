import { useBoolean } from '@chakra-ui/react';
import { type RefObject, useEffect } from 'react';

import { calculateNestingLevel, type TSegment } from '@/features/syntax-editor';

interface UseCalculateNestedLevelProps {
  targetRef: RefObject<HTMLElement>;
  segment: TSegment | null;
  isPending?: boolean;
}

export const useCalculateNestingLevel = ({
  targetRef,
  segment,
  isPending = false,
}: UseCalculateNestedLevelProps) => {
  const [isNestingLevelCalculated, setNestingLevelCalculated] = useBoolean();

  useEffect(() => {
    if (isPending || !segment || !targetRef.current) return;

    calculateNestingLevel(targetRef);
    setNestingLevelCalculated.on();
  }, [isPending, segment, setNestingLevelCalculated, targetRef]);

  return isNestingLevelCalculated;
};
