import { atomWithDefault, atomWithStorage } from 'jotai/utils';
import { Analysis, CurrentAnalysisIndex } from '@/types/analysis';
import { Nullable } from '@/types/common';
import { atom } from 'jotai';
import { INVALID_POPUP_DELAY } from '@/constants/config';
import { generateAnalysis } from '@/utils/analysis';
import { sampleAnalysisList } from '@/constants/sample';

// Analysis
export const userAnalysisListAtom = atomWithStorage<Analysis[]>(
  'userAnalysisListAtom',
  [],
);

export const sampleAnalysisListAtom = atomWithStorage<Analysis[]>(
  'sampleAnalysisListAtom',
  sampleAnalysisList,
);

export const combinedAnalysisListAtom = atomWithDefault((get) => ({
  user: get(userAnalysisListAtom),
  sample: get(sampleAnalysisListAtom),
}));

export const currentAnalysisIndexAtom =
  atom<Nullable<CurrentAnalysisIndex>>(null);

export const addUserAnalysisActionAtom = atom(
  null,
  (get, set, sentence: string) => {
    const analysis = generateAnalysis(sentence);
    set(userAnalysisListAtom, (prev) => [analysis, ...prev]);
  },
);

export const currentAnalysisAtom = atom<Nullable<Analysis>>((get) => {
  const current = get(currentAnalysisIndexAtom);
  if (!current) return null;
  const { from, index } = current;
  const analysisList = get(combinedAnalysisListAtom);
  return analysisList[from][index];
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
