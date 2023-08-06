import { atomWithDefault, atomWithStorage } from 'jotai/utils';
import {
  Analysis,
  AnalysisSourceType,
  CombinedAnalysisList,
} from '@/types/analysis';
import { Nullable } from '@/types/common';
import { atom } from 'jotai';
import { INVALID_POPUP_DELAY } from '@/constants/config';
import { generateAnalysis } from '@/utils/analysis';
import { sampleAnalysisList } from '@/constants/sample';

export const userAnalysisListAtom = atomWithStorage<Analysis[]>(
  'userAnalysisListAtom',
  [],
);

export const sampleAnalysisListAtom = atomWithStorage<Analysis[]>(
  'sampleAnalysisListAtom',
  sampleAnalysisList,
);

export const analysisListBySourceAtom = atomWithDefault<CombinedAnalysisList>(
  (get) => ({
    user: get(userAnalysisListAtom),
    sample: get(sampleAnalysisListAtom),
  }),
);

export const currentAnalysisAtom = atom<Nullable<Analysis>>(null);

export const addUserAnalysisActionAtom = atom(
  null,
  (_, set, payload: { sentence: string; source: AnalysisSourceType }) => {
    const { sentence, source } = payload;
    const analysis = generateAnalysis(sentence, source);
    set(userAnalysisListAtom, (prev) => [analysis, ...prev]);
  },
);

export const addCompleteAnalysisActionAtom = atom(
  null,
  (_, set, analysis: Analysis) => {
    set(userAnalysisListAtom, (prev) => [analysis, ...prev]);
  },
);

export const removeUserAnalysisActionAtom = atom(
  null,
  (_, set, sentenceId: string) => {
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
