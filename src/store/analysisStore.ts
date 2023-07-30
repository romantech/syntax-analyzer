import { atomWithStorage } from 'jotai/utils';
import { Analysis } from '@/types/analysis';
import { Nullable } from '@/types/common';
import { atom } from 'jotai';
import { INVALID_POPUP_DELAY } from '@/constants/config';
import { generateAnalysis } from '@/utils/analysis';

// Analysis
export const analysisListAtom = atomWithStorage<Analysis[]>('analysisList', []);

export const currentAnalysisIndexAtom = atomWithStorage<number>(
  'currentAnalysisIndexAtom',
  0,
);

export const addAnalysisAtom = atom(null, (get, set, sentence: string) => {
  const analysis = generateAnalysis(sentence);
  set(analysisListAtom, (prev) => [...prev, analysis]);
  set(currentAnalysisIndexAtom, get(analysisListAtom).length - 1);
});

export const hasAnalysisDataAtom = atom(
  (get) => get(analysisListAtom).length > 0,
);

export const currentAnalysisAtom = atom<Nullable<Analysis>>((get) => {
  const index = get(currentAnalysisIndexAtom);
  const analysisList = get(analysisListAtom);
  return analysisList[index] ?? null;
});

export const currentSentenceAtom = atom<Nullable<string[]>>((get) => {
  const currentAnalysis = get(currentAnalysisAtom);
  if (!currentAnalysis) return null;
  return currentAnalysis.sentence;
});

export const invalidRangeIndexAtom = atom<Nullable<number>>(null);
export const setAndClearInvalidRangeIndexAtom = atom(
  null,
  (_, set, invalidIndex: number) => {
    set(invalidRangeIndexAtom, invalidIndex);
    setTimeout(() => set(invalidRangeIndexAtom, null), INVALID_POPUP_DELAY);
  },
);
