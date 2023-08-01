import { atomWithDefault, atomWithStorage } from 'jotai/utils';
import {
  Analysis,
  CombinedAnalysisList,
  CombinedAnalysisMap,
} from '@/types/analysis';
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

export const combinedAnalysisListAtom = atomWithDefault<CombinedAnalysisList>(
  (get) => ({
    user: get(userAnalysisListAtom),
    sample: get(sampleAnalysisListAtom),
  }),
);

export const combinedAnalysisMapAtom = atomWithDefault((get) => {
  const combinedList = get(combinedAnalysisListAtom);
  const map: CombinedAnalysisMap = {};

  Object.values(combinedList)
    .flat()
    .forEach((analysis) => {
      map[analysis.id] = analysis;
    });

  return map;
});

export const currentAnalysisAtom = atom<Nullable<Analysis>>(null);

export const addUserAnalysisActionAtom = atom(
  null,
  (get, set, { sentence, source }) => {
    const analysis = generateAnalysis(sentence, source);
    set(userAnalysisListAtom, (prev) => [analysis, ...prev]);
  },
);

export const removeUserAnalysisActionAtom = atom(
  null,
  (get, set, sentenceId: string) => {
    set(userAnalysisListAtom, (prev) =>
      prev.filter((analysis) => analysis.id !== sentenceId),
    );
  },
);

export const invalidRangeIndexAtom = atom<Nullable<number>>(null);
export const setAndClearInvalidRangeIndexAtom = atom(
  null,
  (_, set, invalidIndex: number) => {
    set(invalidRangeIndexAtom, invalidIndex);
    setTimeout(() => set(invalidRangeIndexAtom, null), INVALID_POPUP_DELAY);
  },
);
