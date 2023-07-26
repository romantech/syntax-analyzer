import { MouseEvent, useRef, useState } from 'react';
import { getNearestConstituent } from '@/utils/common.ts';
import { ConstituentDataSet } from '@/types/analysis.ts';
import { useColorMode } from '@chakra-ui/react';
import { DELETE_MODE_COLOR } from '@/constants/constituents.ts';
import { deleteModeAtom } from '@/store/controlPanelStore.ts';
import { useAtomValue } from 'jotai';

export default function useSegmentMouseEvent() {
  const hoverRef = useRef<HTMLElement | null>(null);
  const [targetInfo, setTargetInfo] = useState<ConstituentDataSet | null>(null);
  const { colorMode } = useColorMode();
  const isDeleteMode = useAtomValue(deleteModeAtom);

  const setOriginalColor = () => {
    if (hoverRef.current && isDeleteMode) {
      hoverRef.current.style.removeProperty('color');
      hoverRef.current = null;
    }
  };

  const swapColor = (element: HTMLElement | null) => {
    if (!element) return;

    hoverRef.current = element;
    hoverRef.current.style.color = DELETE_MODE_COLOR(colorMode);

    const { constituent, constituentId } = hoverRef.current.dataset;
    setTargetInfo({ constituent, constituentId });
  };

  const onMouseOver = (event: MouseEvent<HTMLElement>) => {
    if (!isDeleteMode) return;
    const target = event.target as HTMLElement;

    if (target !== hoverRef.current) {
      setOriginalColor();
      swapColor(getNearestConstituent(target));
    }
  };

  return {
    onMouseOver,
    onMouseLeave: setOriginalColor,
    targetInfo,
  };
}
