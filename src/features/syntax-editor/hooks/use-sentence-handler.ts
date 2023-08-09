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
import {
  clearSelection,
  getBeginEndIdxFromSelection,
  MouseEventHandlers,
} from '@/base';
import { MouseEvent } from 'react';

const { TOKEN_INDEX } = CONSTITUENT_DATA_ATTRS;

export default function useSentenceHandler(): MouseEventHandlers {
  const { onMouseOver, onMouseLeave, targetInfo } = useSegmentMouseEvent();

  const isDeleteMode = useAtomValue(deleteModeAtom);
  const selectedTag = useAtomValue(selectedTagAtom);

  const setAndClearInvalidIndex = useSetAtom(setAndClearInvalidRangeIndexAtom);

  const [currentSegment, updateSegment] = useAtom(
    updateSegmentHistoryAndIndexAtom,
  );

  /** 문장 요소 추가 */
  const onMouseUp = ({ detail }: MouseEvent<HTMLElement>) => {
    /** 더블 클릭일 땐 실행 안함. detail 속성은 마우스 클릭 횟수 (더블클릭시 2) */
    if (detail > 1) return;
    /** 태그 리스트에서 태그를 선택했을 때만 실행 */
    if (selectedTag && currentSegment && detail === 1) {
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

  /** 문장 요소 삭제 */
  const onClick = () => {
    /** 삭제 모드이고, 드래그해서 선택한 토큰 정보가 있을 때만 실행 */
    if (isDeleteMode && targetInfo && currentSegment) {
      const constituentId = Number(targetInfo.constituentId);
      const updatedSegment = removeConstituent(currentSegment, constituentId);
      updateSegment(updatedSegment);
    }
  };

  const onMouseDown = (e: MouseEvent<HTMLElement>) => {
    /** 더블 클릭시 텍스트 전체 선택 방지 */
    if (e.detail > 1) e.preventDefault();
  };

  return { onClick, onMouseOver, onMouseLeave, onMouseUp, onMouseDown };
}
