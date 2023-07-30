import { atomWithStorage } from 'jotai/utils';
import { Analysis } from '@/types/analysis';
import { Nullable } from '@/types/common';
import { sampleData } from '@/constants/sample';
import { atom } from 'jotai';
import { INVALID_POPUP_DELAY } from '@/constants/config';

// Analysis
export const analysisListAtom = atomWithStorage<Analysis[]>('analysisList', [
  sampleData, // TODO 임시 데이터 삭제
]);

export const currentAnalysisIndexAtom = atomWithStorage<number>(
  'currentAnalysisIndexAtom',
  0,
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
