import { useBoolean } from '@chakra-ui/react';
import { RefObject, useEffect } from 'react';
import { calculateNestingLevel } from '@/utils/nestingLevelCalculators';

export default function useCalculateNestingLevel(
  targetRef: RefObject<HTMLElement>,
) {
  const [isNestingLevelCalculated, setNestingLevelCalculated] = useBoolean();

  useEffect(() => {
    if (targetRef.current) {
      calculateNestingLevel(targetRef);
      setNestingLevelCalculated.on();
    }
  }, [setNestingLevelCalculated, targetRef]);

  return isNestingLevelCalculated;
}
