import { useResetAtom } from 'jotai/utils';
import { resetSegmentHistoryAtom } from '@/store/segmentHistoryStore';
import { resetControlPanelAtom } from '@/store/controlPanelStore';
import { useEffect } from 'react';

export default function useInitializeSyntaxEditor() {
  const resetSegmentHistory = useResetAtom(resetSegmentHistoryAtom);
  const resetControlPanel = useResetAtom(resetControlPanelAtom);

  useEffect(() => {
    resetSegmentHistory();
    resetControlPanel();
  });
}
