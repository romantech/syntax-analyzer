import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { MouseEvent } from 'react';

import { clearSelection, MouseEventHandlers } from '@/base';
import {
  addConstituent,
  deleteModeAtom,
  generateConstituent,
  removeConstituent,
  selectedTagAtom,
  setAndClearInvalidRangeIndexAtom,
  updateSegmentHistoryAndIndexAtom,
  useSegmentMouseEvent,
  validateSelectionBounds,
} from '@/features/syntax-editor';

/** event.detail 속성은 마우스 클릭 횟수 (더블클릭시 2) */
const isDoubleClicked = (e: MouseEvent) => e.detail > 1;

export const useSentenceHandler = (): MouseEventHandlers => {
  const { onMouseOver, onMouseLeave, targetInfo } = useSegmentMouseEvent();

  const isDeleteMode = useAtomValue(deleteModeAtom);
  const selectedTag = useAtomValue(selectedTagAtom);

  const setAndClearInvalidIndex = useSetAtom(setAndClearInvalidRangeIndexAtom);

  const [segment, updateSegment] = useAtom(updateSegmentHistoryAndIndexAtom);

  /** 문장 성분 추가 */
  const onMouseUp = (e: MouseEvent) => {
    /** 더블 클릭이 아니고, 태그를 선택했을 때만 실행 */
    if (selectedTag && segment && !isDoubleClicked(e)) {
      const { begin, end, isValid } = validateSelectionBounds();
      if (!isValid) {
        setAndClearInvalidIndex(end - 1);
        clearSelection();
        return;
      }

      const constituent = generateConstituent(selectedTag, begin, end);
      const updatedSegment = addConstituent(segment, begin, end, constituent);

      updateSegment(updatedSegment);
    }
  };

  /** 문장 요소 삭제 */
  const onClick = () => {
    /** 삭제 모드이고, 드래그해서 선택한 토큰 정보가 있을 때만 실행 */
    if (isDeleteMode && targetInfo && segment) {
      const constituentId = Number(targetInfo.constituentId);
      const updatedSegment = removeConstituent(segment, constituentId);

      updateSegment(updatedSegment);
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    /** 더블 클릭시 텍스트 전체 선택 방지 */
    if (isDoubleClicked(e)) e.preventDefault();
  };

  return { onClick, onMouseOver, onMouseLeave, onMouseUp, onMouseDown };
};
