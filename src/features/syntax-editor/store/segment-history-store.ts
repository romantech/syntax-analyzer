import { atom } from 'jotai';
import { atomWithDefault, atomWithReset, RESET } from 'jotai/utils';
import {
  AnalysisPathParams,
  currentAnalysisAtom,
  fillSegment,
  removeEmptySegment,
  sampleAnalysisListAtom,
  TSegment,
  userAnalysisListAtom,
} from '@/features/syntax-editor';
import { Nullable } from '@/base';
import { deleteModeAtom, selectedTagAtom } from './control-panel-store';

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

export const segmentHistoryAtom = atomWithDefault<TSegment[]>((get) => {
  const currentAnalysis = get(currentAnalysisAtom);
  return currentAnalysis ? [currentAnalysis.rootSegment] : [];
});

export const resetSegmentHistoryAtom = atom(null, (_, set) => {
  set(segmentHistoryAtom, RESET);
  set(segmentHistoryIndexAtom, RESET);
});

export const currentHistorySegmentAtom = atom<Nullable<TSegment>>((get) => {
  const history = get(segmentHistoryAtom);
  const index = get(segmentHistoryIndexAtom);
  return history[index] ?? null;
});

export const hasAddedTagAtom = atom((get) => {
  const currentSegment = get(currentHistorySegmentAtom);
  return Boolean(currentSegment?.children.length);
});

export const updateSegmentHistoryAndIndexAtom = atom(
  (get) => get(currentHistorySegmentAtom),
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
  (get, set, type: 'undo' | 'redo') => {
    set(segmentHistoryIndexAtom, (prev) => {
      if (type === 'undo') return prev - 1;
      return prev + 1;
    });
    set(deleteModeAtom, RESET);
    set(selectedTagAtom, RESET);
  },
);

export const isSegmentTouchedAtom = atom((get) => {
  const currentAnalysis = get(currentAnalysisAtom)?.rootSegment;
  const currentHistorySegment = get(currentHistorySegmentAtom);
  return currentAnalysis !== currentHistorySegment;
});

export const saveHistorySegmentAtom = atom(
  null,
  (get, set, { source, index }: AnalysisPathParams) => {
    const currentHistorySegment = get(currentHistorySegmentAtom);
    if (!currentHistorySegment) return;

    const analysisList = {
      user: userAnalysisListAtom,
      sample: sampleAnalysisListAtom,
    };
    set(analysisList[source], (prev) => {
      const i = parseInt(index, 10);
      prev[i] = { ...prev[i], rootSegment: currentHistorySegment };
      return [...prev];
    });
  },
);
