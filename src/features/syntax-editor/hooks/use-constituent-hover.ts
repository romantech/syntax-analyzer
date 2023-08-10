import { useAtomValue, useSetAtom } from 'jotai';
import {
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/features/syntax-editor';
import { MouseEvent } from 'react';
import { getNearestElementByClass, MouseEventHandlers } from '@/base';
import { RESET } from 'jotai/utils';
import { CONSTITUENT_CLASSES } from '@/features/syntax-editor/constants';

export default function useConstituentHover(): MouseEventHandlers {
  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const setHoveredConstituent = useSetAtom(hoveredConstituentAtom);

  const onMouseOver = (e: MouseEvent) => {
    if (!isAbbrTooltipVisible) return;

    const element = getNearestElementByClass(
      e.target as HTMLElement,
      CONSTITUENT_CLASSES.CONSTITUENT,
    );

    if (element) {
      const constituentId = Number(element.dataset.constituentId);
      setHoveredConstituent(constituentId);
    }
  };

  const onMouseLeave = () => setHoveredConstituent(RESET);

  return { onMouseOver, onMouseLeave };
}
