import { atomWithDefault, atomWithReset, atomWithStorage } from 'jotai/utils';
import { Analysis, Segment } from '@/types/analysis';
import { Nullable } from '@/types/common';
import { sampleData } from '@/constants/sample';

export const analysisListAtom = atomWithStorage<Analysis[]>('analysisList', [
  sampleData,
]);

export const currentAnalysisIndexAtom = atomWithStorage<Nullable<number>>(
  'currentAnalysisIndexAtom',
  0, // TODO change to null
);

export const currentAnalysisAtom = atomWithDefault<Analysis | null>((get) => {
  const index = get(currentAnalysisIndexAtom);
  const analysisList = get(analysisListAtom);
  return index === null ? null : analysisList[index];
});

export const currentSentenceAtom = atomWithDefault<Nullable<string[]>>(
  (get) => {
    const currentAnalysis = get(currentAnalysisAtom);
    if (!currentAnalysis) return null;
    return currentAnalysis.sentence;
  },
);

export const segmentHistoryAtom = atomWithDefault<Segment[]>((get) => {
  const currentAnalysis = get(currentAnalysisAtom);
  if (!currentAnalysis) return [];
  return [currentAnalysis.rootSegment];
});
export const currentSegmentHistoryIndexAtom = atomWithReset(0);
export const currentSegmentAtom = atomWithDefault<Nullable<Segment>>((get) => {
  const segmentHistory = get(segmentHistoryAtom);
  if (!segmentHistory.length) return null;
  const index = get(currentSegmentHistoryIndexAtom);
  return segmentHistory[index];
});
