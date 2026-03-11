import { useBoolean } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { type RefObject, useEffect } from 'react';

import {
  calculateNestingLevel,
  segmentHistoryIndexAtom,
} from '@/features/syntax-editor';

interface UseCalculateNestedLevelProps {
  targetRef: RefObject<HTMLElement>;
  trigger?: unknown;
}

export const useCalculateNestingLevel = ({
  targetRef,
  trigger,
}: UseCalculateNestedLevelProps) => {
  const [isNestingLevelCalculated, setNestingLevelCalculated] = useBoolean();
  const segmentHistoryIndex = useAtomValue(segmentHistoryIndexAtom);

  // biome-ignore lint/correctness/useExhaustiveDependencies: trigger and segmentHistoryIndex are used only to force recalculation timing.
  useEffect(() => {
    if (targetRef.current) {
      calculateNestingLevel(targetRef);
      setNestingLevelCalculated.on();
    }
  }, [targetRef, trigger, segmentHistoryIndex, setNestingLevelCalculated]);

  return isNestingLevelCalculated;
};
