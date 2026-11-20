import { useAtomValue } from 'jotai';
import { type MouseEvent, useRef } from 'react';

import { type ColorMode, getNearestElementByClass, useColorModeValue } from '@/base';
import { DELETE_MODE_HOVER_COLOR_SCHEME, deleteModeAtom } from '@/features/syntax-editor';
import { CONSTITUENT_CLASSES } from '@/features/syntax-editor/constants';

const { CONSTITUENT } = CONSTITUENT_CLASSES;

export const useSegmentMouseEvent = () => {
  const hoverRef = useRef<HTMLElement | null>(null);
  const colorMode = useColorModeValue<ColorMode>('light', 'dark');
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
    hoverRef.current.style.color = DELETE_MODE_HOVER_COLOR_SCHEME(colorMode);
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
