import { atomWithDefault, atomWithStorage } from 'jotai/utils';
import { Nullable } from '@/types';
import { atom } from 'jotai';
import { INVALID_POPUP_DELAY } from '@/constants/config';
import {
  AnalysisSource,
  CombinedAnalysisList,
  generateAnalysis,
  sampleAnalysis,
  TAnalysis,
} from '@/features/syntax-editor';

export const userAnalysisListAtom = atomWithStorage<TAnalysis[]>(
  'userAnalysisList',
  [],
);

export const sampleAnalysisListAtom = atom<TAnalysis[]>(sampleAnalysis);

export const analysisListBySourceAtom = atomWithDefault<CombinedAnalysisList>(
  (get) => ({
    user: get(userAnalysisListAtom),
    sample: get(sampleAnalysisListAtom),
  }),
);

export const currentAnalysisAtom = atom<Nullable<TAnalysis>>(null);

export const addUserAnalysisActionAtom = atom(
  null,
  (_, set, payload: { sentence: string; source: AnalysisSource }) => {
    const { sentence, source } = payload;
    const analysis = generateAnalysis(sentence, source);
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
