import { useSegmentMouseEvent } from '@/hooks/index';
import { useAtom, useAtomValue } from 'jotai';
import { deleteModeAtom } from '@/store/controlPanelStore';
import { removeConstituent } from '@/utils/segmentManipulation.ts';
import { updateSegmentAndIncrementIndexAtom } from '@/store/segmentHistoryStore.ts';

export default function useSentenceHandlers() {
  const { onMouseOver, onMouseLeave, targetInfo } = useSegmentMouseEvent();
  const isDeleteMode = useAtomValue(deleteModeAtom);
  const [segment, updateSegment] = useAtom(updateSegmentAndIncrementIndexAtom);

  /** 삭제 */
  const onClick = () => {
    if (isDeleteMode && targetInfo && segment) {
      const constituentId = Number(targetInfo.constituentId);
      const updatedSegment = removeConstituent(segment, constituentId);
      updateSegment(updatedSegment);
    }
  };

  return { onClick, onMouseOver, onMouseLeave };
}
