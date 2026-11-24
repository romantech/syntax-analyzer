import { useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import type { SyntheticEvent } from 'react';

import {
  CONSTITUENT_DATA_ATTRS,
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/features/syntax-editor';

export const useConstituentHover = () => {
  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const setHoveredConstituent = useSetAtom(hoveredConstituentAtom);

  const onMouseOver = ({ target }: SyntheticEvent) => {
    if (!isAbbrTooltipVisible) return;

    const element =
      target instanceof Element && target.closest<HTMLElement>(`[${CONSTITUENT_DATA_ATTRS.ID}]`);

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
