import { atomWithDefault, atomWithStorage } from 'jotai/utils';
import { Nullable } from '@/base';
import { atom } from 'jotai';
import {
  AnalysisSource,
  CombinedAnalysisList,
  generateAnalysis,
  TAnalysis,
} from '@/features/syntax-editor';
import { SAMPLE_ANALYSIS } from '@/features/syntax-editor/data';
import { INVALID_POPUP_DELAY } from '@/features/syntax-editor/constants';

export const userAnalysisListAtom = atomWithStorage<TAnalysis[]>(
  'userAnalysisList',
  [],
);

export const sampleAnalysisListAtom = atom<TAnalysis[]>(SAMPLE_ANALYSIS);

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
