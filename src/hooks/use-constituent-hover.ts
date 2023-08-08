import { useAtomValue, useSetAtom } from 'jotai';
import {
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/store/control-panel-store';
import { DOMAttributes, MouseEvent } from 'react';
import { getNearestElementByClass } from '@/utils/selection';
import { RESET } from 'jotai/utils';

type ConstituentMouseEventType = 'onMouseOver' | 'onMouseLeave';
type UseConstituentHoverReturnType = Pick<
  DOMAttributes<HTMLElement>,
  ConstituentMouseEventType
>;

export default function useConstituentHover(): UseConstituentHoverReturnType {
  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const setHoveredConstituent = useSetAtom(hoveredConstituentAtom);

  const onMouseOver = (e: MouseEvent) => {
    if (!isAbbrTooltipVisible) return;
    const element = getNearestElementByClass(e.target as HTMLElement);
    if (element) {
      setHoveredConstituent(Number(element.dataset.constituentId));
    }
  };

  const onMouseLeave = () => setHoveredConstituent(RESET);

  return { onMouseOver, onMouseLeave };
}
