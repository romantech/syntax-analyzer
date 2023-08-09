import { MouseEvent, useRef, useState } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { deleteModeAtom } from '@/store';
import { useAtomValue } from 'jotai';
import { getNearestElementByClass } from '@/base';
import {
  CONSTITUENT_CLASSES,
  ConstituentDataSet,
  DELETE_MODE_HOVER_COLOR_SCHEME,
} from '@/features/syntax-editor';

const { CONSTITUENT } = CONSTITUENT_CLASSES;

export default function useSegmentMouseEvent() {
  const hoverRef = useRef<HTMLElement | null>(null);
  const [targetInfo, setTargetInfo] = useState<ConstituentDataSet | null>(null);
  const { colorMode } = useColorMode();
  const isDeleteMode = useAtomValue(deleteModeAtom);

  const restoreOriginalColor = () => {
    if (hoverRef.current && isDeleteMode) {
      hoverRef.current.style.removeProperty('color');
      hoverRef.current = null;
      setTargetInfo(null);
    }
  };

  const swapColor = (element: HTMLElement | null) => {
    if (!element) return;

    hoverRef.current = element;
    hoverRef.current.style.color = DELETE_MODE_HOVER_COLOR_SCHEME(colorMode);

    const { constituentLabel, constituentId } = hoverRef.current.dataset;
    setTargetInfo({ constituentLabel, constituentId });
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
    targetInfo,
  };
}
