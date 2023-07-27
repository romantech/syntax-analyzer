import { useAtomValue, useSetAtom } from 'jotai';
import { getNearestConstituent } from '@/utils/common.ts';
import {
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/store/controlPanelStore.ts';
import { DOMAttributes, MouseEvent } from 'react';

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
    const element = getNearestConstituent(e.target as HTMLElement);
    if (element) {
      setHoveredConstituent(Number(element.dataset.constituentId));
    }
  };

  const onMouseLeave = () => setHoveredConstituent(null);

  return { onMouseOver, onMouseLeave };
}
