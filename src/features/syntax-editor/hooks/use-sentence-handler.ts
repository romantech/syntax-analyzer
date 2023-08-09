import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  addConstituent,
  CONSTITUENT_DATA_ATTRS,
  deleteModeAtom,
  generateConstituent,
  removeConstituent,
  selectedTagAtom,
  setAndClearInvalidRangeIndexAtom,
  updateSegmentHistoryAndIndexAtom,
  useSegmentMouseEvent,
} from '@/features/syntax-editor';
import { clearSelection, getBeginEndIdxFromSelection } from '@/base';

const { TOKEN_INDEX } = CONSTITUENT_DATA_ATTRS;

export default function useSentenceHandler() {
  const { onMouseOver, onMouseLeave, targetInfo } = useSegmentMouseEvent();

  const isDeleteMode = useAtomValue(deleteModeAtom);
  const selectedTag = useAtomValue(selectedTagAtom);

  const setAndClearInvalidIndex = useSetAtom(setAndClearInvalidRangeIndexAtom);

  const [currentSegment, updateSegment] = useAtom(
    updateSegmentHistoryAndIndexAtom,
  );

  /** 추가 */
  const onMouseUp = () => {
    /** 태그 리스트에서 태그를 선택했을 때만 실행 */
    if (selectedTag && currentSegment) {
      const { begin, end } = getBeginEndIdxFromSelection(TOKEN_INDEX);
      const onInvalid = () => {
        setAndClearInvalidIndex(end - 1);
        clearSelection();
      };
      const updatedSegment = addConstituent(
        currentSegment,
        begin,
        end,
        generateConstituent(selectedTag, begin, end),
        onInvalid,
      );
      if (currentSegment !== updatedSegment) updateSegment(updatedSegment);
    }
  };

  /** 삭제 */
  const onClick = () => {
    /** 삭제 모드이고, 드래그해서 선택한 토큰 정보가 있을 때만 실행 */
    if (isDeleteMode && targetInfo && currentSegment) {
      const constituentId = Number(targetInfo.constituentId);
      const updatedSegment = removeConstituent(currentSegment, constituentId);
      updateSegment(updatedSegment);
    }
  };

  return { onClick, onMouseOver, onMouseLeave, onMouseUp };
}
