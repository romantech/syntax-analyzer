import { atom } from 'jotai/index';
import { Segment } from '@/types/analysis.ts';
import { atomWithDefault, atomWithReset } from 'jotai/utils';
import { currentAnalysisAtom } from '@/store/analysisStore.ts';
import { Nullable } from '@/types/common';

/**
 * useResetAtom 혹은 RESET 심볼을 이용해 초기값으로 되돌릴 수 있음
 * @see https://jotai.org/docs/utilities/resettable#atomwithreset
 *  */
export const segmentHistoryIndexAtom = atomWithReset(0);
/**
 * atomWithDefault 사용시 read function으로 초기값을 지정할 수 있음
 * write function은 atom()과 동일하게 사용 가능
 * e.g. setState(...) 혹은 setState(prev => ...) 형태로 사용 가능
 * useResetAtom 혹은 RESET 심볼을 이용해 초기값으로 되돌릴 수 있음
 * @see https://jotai.org/docs/utilities/resettable#atomwithdefault
 * */

export const segmentHistoryAtom = atomWithDefault<Segment[]>((get) => {
  const currentAnalysis = get(currentAnalysisAtom);
  return currentAnalysis ? [currentAnalysis.rootSegment] : [];
});

export const currentSegmentAtom = atom<Nullable<Segment>>((get) => {
  const history = get(segmentHistoryAtom);
  const index = get(segmentHistoryIndexAtom);
  return history[index] ?? null;
});

export const incrementHistoryIndexAtom = atom(null, (get, set) => {
  set(segmentHistoryIndexAtom, get(segmentHistoryIndexAtom) + 1);
});

export const updateSegmentAndIncrementIndexAtom = atom(
  (get) => get(currentSegmentAtom),
  (get, set, updatedChildren: Segment[]) => {
    const currentSegment = get(currentSegmentAtom);
    if (!currentSegment) return;

    const updatedSegment = { ...currentSegment, children: updatedChildren };

    set(segmentHistoryAtom, (prev) => [...prev, updatedSegment]);
    set(incrementHistoryIndexAtom);
  },
);
