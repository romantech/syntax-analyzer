import { type RefObject, useLayoutEffect } from 'react';

import { calculateNestingLevel, type TSegment } from '@/features/syntax-editor';
import type { getOverviewDetails } from '@/features/syntax-editor/helpers/overview-details';

interface UseCalculateNestedLevelProps {
  targetRef: RefObject<HTMLElement | null>;
  segment: TSegment;
  isTapMode: boolean;
  overviewDetails: ReturnType<typeof getOverviewDetails> | undefined;
  showFullTagNames: boolean;
  language: string | undefined;
}

export const useCalculateNestingLevel = ({
  targetRef,
  segment,
  isTapMode,
  overviewDetails,
  showFullTagNames,
  language,
}: UseCalculateNestedLevelProps) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: rendered tags and label text determine the layout.
  useLayoutEffect(() => {
    const updateLayout = () => calculateNestingLevel(targetRef, isTapMode);
    updateLayout();
    document.fonts.addEventListener('loadingdone', updateLayout);
    return () => document.fonts.removeEventListener('loadingdone', updateLayout);
  }, [segment, overviewDetails, showFullTagNames, language, targetRef, isTapMode]);
};
