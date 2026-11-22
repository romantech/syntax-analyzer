import { useAtomValue } from 'jotai';
import { type MouseEvent, useRef } from 'react';

import { getNearestElementByClass } from '@/base';
import { deleteModeAtom } from '@/features/syntax-editor';
import { CONSTITUENT_CLASSES } from '@/features/syntax-editor/constants';

const { CONSTITUENT } = CONSTITUENT_CLASSES;

export const useSegmentMouseEvent = () => {
  const hoverRef = useRef<HTMLElement | null>(null);
  const isDeleteMode = useAtomValue(deleteModeAtom);

  const restoreOriginalColor = () => {
    if (hoverRef.current && isDeleteMode) {
      hoverRef.current.style.removeProperty('color');
      hoverRef.current = null;
    }
  };

  const swapColor = (element: HTMLElement | null) => {
    if (!element) return;

    hoverRef.current = element;
    hoverRef.current.style.color = 'var(--chakra-colors-fg-muted)';
  };

  const onMouseOver = (event: MouseEvent<HTMLElement>) => {
    if (!isDeleteMode) return;
    const target = event.target as HTMLElement;

    if (target !== hoverRef.current) {
      restoreOriginalColor();
      swapColor(getNearestElementByClass(target, CONSTITUENT));
    }
  };

  return {
    onMouseOver,
    onMouseLeave: restoreOriginalColor,
  };
};
