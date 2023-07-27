import { useSegmentMouseEvent } from '@/hooks/index';
import { useAtom, useAtomValue } from 'jotai';
import { deleteModeAtom } from '@/store/controlPanelStore';
import { removeConstituent } from '@/utils/segmentManipulation.ts';
import { updateSegmentAndIncrementIndexAtom } from '@/store/segmentHistoryStore.ts';

export default function useSegmentHandler() {
  const { onMouseOver, onMouseLeave, targetInfo } = useSegmentMouseEvent();
  const isDeleteMode = useAtomValue(deleteModeAtom);
  const [segment, updateSegment] = useAtom(updateSegmentAndIncrementIndexAtom);

  /** 삭제 */
  const onClick = () => {
    if (!isDeleteMode) return;
    if (targetInfo?.constituentId && segment) {
      const updatedSegments = removeConstituent(
        segment.children,
        Number(targetInfo.constituentId),
      );
      updateSegment(updatedSegments);
    }
  };

  return { onClick, onMouseOver, onMouseLeave };
}
