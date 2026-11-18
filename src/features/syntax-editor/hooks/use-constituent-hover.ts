import { useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import type { SyntheticEvent } from 'react';

import { getNearestElementByClass } from '@/base';
import {
  CONSTITUENT_CLASSES,
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/features/syntax-editor';

export const useConstituentHover = () => {
  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const setHoveredConstituent = useSetAtom(hoveredConstituentAtom);

  const onMouseOver = ({ target }: SyntheticEvent) => {
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

  return {
    onMouseOver,
    onMouseLeave,
    onFocus: onMouseOver,
    onBlur: onMouseLeave,
    onClick: onMouseOver,
  };
};
