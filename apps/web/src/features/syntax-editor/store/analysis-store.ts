import { atom, createStore, type Getter, type Setter } from 'jotai';
import { atomWithDefault, atomWithStorage, createJSONStorage } from 'jotai/utils';

import { debounce, type Nullable } from '@/base';
import { INVALID_POPUP_DELAY } from '@/features/syntax-editor/constants/settings';
import { SAMPLE_ANALYSIS } from '@/features/syntax-editor/data/sample-analysis';
import type {
  CombinedAnalysisList,
  TAnalysis,
  TSegment,
} from '@/features/syntax-editor/types/analysis';

export const analysisStore = createStore();

const userAnalysisListKey = 'userAnalysisList';
const userAnalysisStorage = createJSONStorage<TAnalysis[]>();

export const userAnalysisListAtom = atomWithStorage(userAnalysisListKey, [], userAnalysisStorage);

export const sampleAnalysisListAtom = atom<TAnalysis[]>(SAMPLE_ANALYSIS);

export const analysisListBySourceAtom = atomWithDefault<CombinedAnalysisList>((get) => ({
  user: get(userAnalysisListAtom),
  sample: get(sampleAnalysisListAtom),
}));

export const selectedAnalysisAtom = atom<Nullable<TAnalysis>>(null);

export const addUserAnalysisActionAtom = atom(null, (_get, set, analysis: TAnalysis) => {
  // The editor's storage atom may be unmounted while the analyzer is open.
  const latestAnalyses = userAnalysisStorage.getItem(userAnalysisListKey, []);
  set(userAnalysisListAtom, [analysis, ...latestAnalyses]);
});

export const removeUserAnalysisActionAtom = atom(null, (_, set, sentenceId: string) => {
  set(userAnalysisListAtom, (prev) => prev.filter((analysis) => analysis.id !== sentenceId));
});

export const saveSelectedAnalysisSegmentAtom = atom(null, (get, set, rootSegment: TSegment) => {
  const selectedAnalysis = get(selectedAnalysisAtom);
  if (!selectedAnalysis) return false;

  const isUserAnalysis = selectedAnalysis.source === 'user';
  const listAtom = isUserAnalysis ? userAnalysisListAtom : sampleAnalysisListAtom;
  // Read storage directly in case the other tab's storage event has not arrived yet.
  const analyses = isUserAnalysis
    ? userAnalysisStorage.getItem(userAnalysisListKey, [])
    : get(listAtom);
  const index = analyses.findIndex(({ id }) => id === selectedAnalysis.id);
  if (index === -1) return false;

  const updatedAnalysis = { ...analyses[index], rootSegment };
  const updatedAnalyses = [...analyses];
  updatedAnalyses[index] = updatedAnalysis;
  set(listAtom, updatedAnalyses);
  set(selectedAnalysisAtom, updatedAnalysis);
  return true;
});

export const invalidRangeIndexAtom = atom<Nullable<number>>(null);

const debouncedClearInvalidRange = debounce((_get: Getter, set: Setter) => {
  set(invalidRangeIndexAtom, null);
}, INVALID_POPUP_DELAY);

export const setAndClearInvalidRangeIndexAtom = atom(null, (_get, set, invalidIndex: number) => {
  set(invalidRangeIndexAtom, invalidIndex);
  debouncedClearInvalidRange(_get, set);
});
