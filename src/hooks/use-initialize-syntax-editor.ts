import { useResetAtom } from 'jotai/utils';
import { resetSegmentHistoryAtom } from '@/store/segment-history-store';
import { resetControlPanelAtom } from '@/store/control-panel-store';
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
