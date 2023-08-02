import { useResetAtom } from 'jotai/utils';
import { resetSegmentHistoryAtom } from '@/store/segmentHistoryStore';
import { resetControlPanelAtom } from '@/store/controlPanelStore';
import { useCallback, useEffect } from 'react';

interface UseInitializeSyntaxEditorProps {
  autoReset?: boolean;
}

export default function useInitializeSyntaxEditor({
  autoReset = false,
}: UseInitializeSyntaxEditorProps = {}) {
  const resetSegmentHistory = useResetAtom(resetSegmentHistoryAtom);
  const resetControlPanel = useResetAtom(resetControlPanelAtom);

  const initializer = useCallback(() => {
    [resetSegmentHistory, resetControlPanel].forEach((reset) => reset());
  }, [resetControlPanel, resetSegmentHistory]);

  useEffect(() => {
    if (autoReset) initializer();
  }, [autoReset, initializer]);

  return initializer;
}
