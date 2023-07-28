import { useSegmentMouseEvent } from '@/hooks/index';
import { useAtom, useAtomValue } from 'jotai';
import { deleteModeAtom, selectedTagAtom } from '@/store/controlPanelStore';
import {
  addConstituent,
  fillSegment,
  removeConstituent,
  removeEmptySegment,
} from '@/utils/segmentManipulation';
import { updateSegmentHistoryAndIndexAtom } from '@/store/segmentHistoryStore';
import { getBeginEndIdxFromSelection } from '@/utils/textSelection';
import { generateNumberID } from '@/utils/common';

export default function useSentenceHandlers() {
  const { onMouseOver, onMouseLeave, targetInfo } = useSegmentMouseEvent();
  const isDeleteMode = useAtomValue(deleteModeAtom);
  const selectedTag = useAtomValue(selectedTagAtom);
  const [currentSegment, updateSegment] = useAtom(
    updateSegmentHistoryAndIndexAtom,
  );

  /** 추가 */
  const onMouseUp = () => {
    /** 태그 리스트에서 태그를 선택했을 때만 실행 */
    if (selectedTag && currentSegment) {
      const { begin, end } = getBeginEndIdxFromSelection();
      const constituent = { ...selectedTag, id: generateNumberID() };
      const updatedSegment = addConstituent(
        currentSegment,
        begin,
        end,
        constituent,
      );
      const filledSegment = fillSegment(updatedSegment, currentSegment.end);
      updateSegment(filledSegment);
    }
  };

  /** 삭제 */
  const onClick = () => {
    /** 삭제 모드이고, 드래그해서 선택한 토큰 정보가 있을 때만 실행 */
    if (isDeleteMode && targetInfo && currentSegment) {
      const constituentId = Number(targetInfo.constituentId);
      const updatedSegment = removeConstituent(currentSegment, constituentId);
      const cleanedSegment = removeEmptySegment(updatedSegment);
      const filledSegment = fillSegment(cleanedSegment, currentSegment.end);
      updateSegment(filledSegment);
    }
  };

  return { onClick, onMouseOver, onMouseLeave, onMouseUp };
}
