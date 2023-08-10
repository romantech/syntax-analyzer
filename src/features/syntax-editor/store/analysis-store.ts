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

export const selectedAnalysisAtom = atom<Nullable<TAnalysis>>(null);

export const addUserAnalysisActionAtom = atom(
  null,
  (_get, set, payload: { sentence: string; source: AnalysisSource }) => {
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
