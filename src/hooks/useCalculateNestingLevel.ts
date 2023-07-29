import { useBoolean } from '@chakra-ui/react';
import { RefObject, useEffect } from 'react';
import { calculateNestingLevel } from '@/utils/nestingLevels.ts';
import { useAtomValue } from 'jotai';
import { segmentHistoryIndexAtom } from '@/store/segmentHistoryStore.ts';

export default function useCalculateNestingLevel(
  targetRef: RefObject<HTMLElement>,
) {
  const [isNestingLevelCalculated, setNestingLevelCalculated] = useBoolean();
  const segmentHistoryIndex = useAtomValue(segmentHistoryIndexAtom);

  useEffect(() => {
    if (targetRef.current) {
      calculateNestingLevel(targetRef);
      setNestingLevelCalculated.on();
    }
  }, [setNestingLevelCalculated, targetRef, segmentHistoryIndex]);

  return isNestingLevelCalculated;
}
