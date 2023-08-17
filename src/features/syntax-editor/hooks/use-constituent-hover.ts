import { useAtomValue, useSetAtom } from 'jotai';
import {
  CONSTITUENT_CLASSES,
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/features/syntax-editor';
import { MouseEvent } from 'react';
import { getNearestElementByClass, MouseEventHandlers } from '@/base';
import { RESET } from 'jotai/utils';

export const useConstituentHover = (): MouseEventHandlers => {
  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const setHoveredConstituent = useSetAtom(hoveredConstituentAtom);

  const onMouseOver = ({ target }: MouseEvent) => {
    if (!isAbbrTooltipVisible) return;

    const element = getNearestElementByClass(
      target as HTMLElement,
      CONSTITUENT_CLASSES.CONSTITUENT,
    );

    if (element) {
      const constituentId = Number(element.dataset.constituentId);
      setHoveredConstituent(constituentId);
    }
  };

  const onMouseLeave = () => setHoveredConstituent(RESET);

  return { onMouseOver, onMouseLeave };
};
