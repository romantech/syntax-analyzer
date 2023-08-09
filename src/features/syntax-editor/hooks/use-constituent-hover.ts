import { useAtomValue, useSetAtom } from 'jotai';
import { hoveredConstituentAtom, isAbbrTooltipVisibleAtom } from '@/store';
import { DOMAttributes, MouseEvent } from 'react';
import { getNearestElementByClass } from '@/base';
import { RESET } from 'jotai/utils';
import { CONSTITUENT_CLASSES } from '@/features/syntax-editor/constants';

type ConstituentMouseEventType = 'onMouseOver' | 'onMouseLeave';
type UseConstituentHoverReturnType = Pick<
  DOMAttributes<HTMLElement>,
  ConstituentMouseEventType
>;

const { CONSTITUENT } = CONSTITUENT_CLASSES;

export default function useConstituentHover(): UseConstituentHoverReturnType {
  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const setHoveredConstituent = useSetAtom(hoveredConstituentAtom);

  const onMouseOver = (e: MouseEvent) => {
    if (!isAbbrTooltipVisible) return;
    const element = getNearestElementByClass(
      e.target as HTMLElement,
      CONSTITUENT,
    );
    if (element) {
      setHoveredConstituent(Number(element.dataset.constituentId));
    }
  };

  const onMouseLeave = () => setHoveredConstituent(RESET);

  return { onMouseOver, onMouseLeave };
}
