import { atomWithDefault, atomWithStorage } from 'jotai/utils';
import { Analysis, AnalysisInfo, CombinedAnalysisList } from '@/types/analysis';
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

export const currentAnalysisAtom = atom<Nullable<Analysis>>(null);

export const setCurrentAnalysisAtom = atom(
  null,
  (get, set, analysisInfo: AnalysisInfo) => {
    const { source, index } = analysisInfo;
    set(currentAnalysisAtom, get(combinedAnalysisListAtom)[source][index]);
  },
);

export const addUserAnalysisActionAtom = atom(
  null,
  (get, set, sentence: string) => {
    const analysis = generateAnalysis(sentence);
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
