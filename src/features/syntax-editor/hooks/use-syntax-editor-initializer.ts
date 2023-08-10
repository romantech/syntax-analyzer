import { useResetAtom } from 'jotai/utils';
import {
  resetControlPanelAtom,
  resetSegmentHistoryAtom,
} from '@/features/syntax-editor';
import { useCallback, useEffect } from 'react';

interface UseInitializerProps {
  resetOnUnmount?: boolean;
}

export default function useSyntaxEditorInitializer({
  resetOnUnmount = false,
}: UseInitializerProps = {}) {
  const resetSegmentHistory = useResetAtom(resetSegmentHistoryAtom);
  const resetControlPanel = useResetAtom(resetControlPanelAtom);

  const initializer = useCallback(() => {
    [resetSegmentHistory, resetControlPanel].forEach((reset) => reset());
  }, [resetControlPanel, resetSegmentHistory]);

  useEffect(() => {
    return () => {
      if (resetOnUnmount) initializer();
    };
  }, [resetOnUnmount, initializer]);

  return { initializer };
}
