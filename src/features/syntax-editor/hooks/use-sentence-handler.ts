import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { type MouseEvent, type PointerEvent, useRef } from 'react';

import { clearSelection } from '@/base';
import {
  applySelectedTagAtom,
  CONSTITUENT_CLASSES,
  CONSTITUENT_DATA_ATTRS,
  deleteModeAtom,
  removeConstituent,
  selectedTagAtom,
  selectedTokenRangeAtom,
  updateSegmentHistoryAndIndexAtom,
  useSegmentMouseEvent,
} from '@/features/syntax-editor';

/** event.detail 속성은 마우스 클릭 횟수 (더블클릭시 2) */
const isDoubleClicked = (e: MouseEvent) => e.detail > 1;

export const useSentenceHandler = (isTapMode: boolean) => {
  const { onMouseOver, onMouseLeave } = useSegmentMouseEvent();
  const pointerStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const wasTap = useRef(false);
  const mouseStartIndex = useRef<number | null>(null);

  const isDeleteMode = useAtomValue(deleteModeAtom);
  const selectedTag = useAtomValue(selectedTagAtom);

  const applySelectedTag = useSetAtom(applySelectedTagAtom);
  const setSelectedRange = useSetAtom(selectedTokenRangeAtom);

  const [segment, updateSegment] = useAtom(updateSegmentHistoryAndIndexAtom);

  /** 문장 성분 추가 */
  const onMouseUp = (e: MouseEvent) => {
    if (isTapMode || !selectedTag || !segment || isDoubleClicked(e) || e.button !== 0) return;

    // 브라우저 캐럿이 인접 요소로 옮겨져도 실제 누른 단어를 경계로 삼는다.
    const clickedToken =
      e.target instanceof Element && e.target.closest(`[${CONSTITUENT_DATA_ATTRS.INDEX}]`);
    const start = mouseStartIndex.current;
    mouseStartIndex.current = null;
    if (!clickedToken || start === null) return;
    const end = Number(clickedToken.getAttribute(CONSTITUENT_DATA_ATTRS.INDEX));
    applySelectedTag(Math.min(start, end), Math.max(start, end) + 1);
    clearSelection();
  };

  /** 문장 요소 삭제 */
  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (isTapMode && event.detail !== 0 && !wasTap.current) return;
    wasTap.current = false;
    const target = event.target as HTMLElement;
    if (isDeleteMode && segment) {
      const constituent = target.closest(`.${CONSTITUENT_CLASSES.CONSTITUENT}`);
      if (!constituent) return;
      const id = Number(constituent.getAttribute(CONSTITUENT_DATA_ATTRS.ID));
      updateSegment(removeConstituent(segment, id));
    } else if (isTapMode && selectedTag) {
      const token = target.closest(`[${CONSTITUENT_DATA_ATTRS.INDEX}]`);
      if (!token) return;
      const index = Number(token.getAttribute(CONSTITUENT_DATA_ATTRS.INDEX));
      setSelectedRange((previous) => [previous?.[0] ?? index, index]);
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    const token =
      e.target instanceof Element && e.target.closest(`[${CONSTITUENT_DATA_ATTRS.INDEX}]`);
    mouseStartIndex.current = token
      ? Number(token.getAttribute(CONSTITUENT_DATA_ATTRS.INDEX))
      : null;
    /** 더블 클릭시 텍스트 전체 선택 방지 */
    if (isDoubleClicked(e)) e.preventDefault();
  };

  const onPointerDown = (event: PointerEvent) => {
    wasTap.current = false;
    pointerStart.current = event.isPrimary
      ? { id: event.pointerId, x: event.clientX, y: event.clientY }
      : null;
  };
  const onPointerMove = (event: PointerEvent) => {
    const start = pointerStart.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) {
      pointerStart.current = null;
    }
  };
  const onPointerUp = (event: PointerEvent) => {
    const start = pointerStart.current;
    wasTap.current = Boolean(
      start &&
        start.id === event.pointerId &&
        Math.hypot(event.clientX - start.x, event.clientY - start.y) <= 10,
    );
    pointerStart.current = null;
  };
  const onPointerCancel = () => {
    pointerStart.current = null;
    wasTap.current = false;
  };

  return {
    onClick,
    onMouseOver,
    onMouseLeave,
    onMouseUp,
    onMouseDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
};
