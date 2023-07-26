import { useAtom, useAtomValue } from 'jotai';
import { getNearestConstituent } from '@/utils/common.ts';
import { shouldOpenAbbrTooltipAtom } from '@/store/controlPanelStore.ts';
import { hoveredConstituentAtom } from '@/store/analysisStore.ts';
import { DOMAttributes, MouseEvent } from 'react';

type ConstituentMouseEventType = 'onMouseOver' | 'onMouseLeave';
type UseConstituentHoverReturnType = Pick<
  DOMAttributes<HTMLElement>,
  ConstituentMouseEventType
>;

export default function useConstituentHover(): UseConstituentHoverReturnType {
  const isTooltipOpen = useAtomValue(shouldOpenAbbrTooltipAtom);
  const [, setHoveredConstituent] = useAtom(hoveredConstituentAtom);

  const onMouseOver = (e: MouseEvent) => {
    if (!isTooltipOpen) return;
    const element = getNearestConstituent(e.target as HTMLElement);
    if (element) {
      setHoveredConstituent(Number(element.dataset.constituentId));
    }
  };

  const onMouseLeave = () => setHoveredConstituent(null);

  return { onMouseOver, onMouseLeave };
}
