import { atom } from 'jotai';
import { atomWithDefault, atomWithReset, RESET } from 'jotai/utils';

import { Nullable } from '@/base';
import {
  AnalysisPathParams,
  fillSegment,
  removeEmptySegment,
  resetControlPanelAtom,
  sampleAnalysisListAtom,
  selectedAnalysisAtom,
  TSegment,
  userAnalysisListAtom,
} from '@/features/syntax-editor';

import { deleteModeAtom } from './control-panel-store';

/**
 * useResetAtom 혹은 RESET 심볼을 이용해 초기값으로 되돌릴 수 있음
 * @see https://jotai.org/docs/utilities/resettable#atomwithreset
 *  */
export const segmentHistoryIndexAtom = atomWithReset(0);
/**
 * atomWithDefault 사용시 read function 으로 초기값을 지정할 수 있음
 * write function 은 atom()과 동일하게 사용 가능
 * e.g. setState(...) 혹은 setState(prev => ...) 형태로 사용 가능
 * useResetAtom 혹은 RESET 심볼을 이용해 초기값으로 되돌릴 수 있음
 * @see https://jotai.org/docs/utilities/resettable#atomwithdefault
 * */

export const segmentHistoryAtom = atomWithDefault<TSegment[]>((get) => {
  const selectedAnalysis = get(selectedAnalysisAtom);
  return selectedAnalysis ? [selectedAnalysis.rootSegment] : [];
});

export const resetSegmentHistoryAtom = atom(null, (_, set) => {
  set(segmentHistoryAtom, RESET);
  set(segmentHistoryIndexAtom, RESET);
});

export const currentSegmentFromHistoryAtom = atom<Nullable<TSegment>>((get) => {
  const history = get(segmentHistoryAtom);
  const index = get(segmentHistoryIndexAtom);
  return history[index] ?? null;
});

export const updateSegmentHistoryAndIndexAtom = atom(
  (get) => get(currentSegmentFromHistoryAtom),
  (get, set, updatedSegment: TSegment) => {
    const cleanedSegment = removeEmptySegment(updatedSegment);
    const filledSegment = fillSegment(cleanedSegment, updatedSegment.end);

    set(segmentHistoryAtom, (prev) => {
      const newHistory = [...prev, filledSegment];
      set(segmentHistoryIndexAtom, newHistory.length - 1);
      return newHistory;
    });

    if (!get(hasAddedTagAtom)) set(deleteModeAtom, RESET);
  },
);

export const undoRedoAbilityAtom = atom((get) => {
  const index = get(segmentHistoryIndexAtom);
  const history = get(segmentHistoryAtom);

  return {
    undo: index > 0,
    redo: index < history.length - 1,
  };
});

export const undoRedoActionAtom = atom(
  (get) => get(undoRedoAbilityAtom),
  (_get, set, type: 'undo' | 'redo') => {
    set(segmentHistoryIndexAtom, (prev) => {
      if (type === 'undo') return prev - 1;
      return prev + 1;
    });

    set(resetControlPanelAtom);
  },
);

export const hasAddedTagAtom = atom((get) => {
  const segment = get(currentSegmentFromHistoryAtom);
  return Boolean(segment?.children.length);
});

export const isSegmentTouchedAtom = atom((get) => {
  const segmentFromAnalysis = get(selectedAnalysisAtom)?.rootSegment;
  const segmentFromHistory = get(currentSegmentFromHistoryAtom);
  return segmentFromAnalysis !== segmentFromHistory;
});

export const saveHistorySegmentAtom = atom(
  null,
  (get, set, { source, index }: AnalysisPathParams) => {
    const segment = get(currentSegmentFromHistoryAtom);
    if (!segment) return;

    const analysisList = {
      user: userAnalysisListAtom,
      sample: sampleAnalysisListAtom,
    };

    set(analysisList[source], (prev) => {
      const i = parseInt(index, 10);
      prev[i] = { ...prev[i], rootSegment: segment };
      set(selectedAnalysisAtom, prev[i]);
      return [...prev];
    });

    set(resetControlPanelAtom);
  },
);
