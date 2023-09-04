import { useCallback } from 'react';

import { useLocalStorage } from '@/base';
import {
  analysisStore,
  TAnalysis,
  userAnalysisListAtom,
} from '@/features/syntax-editor';

export const useInjectAnalysis = () => {
  const [userAnalysis] = useLocalStorage<TAnalysis[]>('userAnalysisList', []);

  const injectAnalysis = useCallback(
    (analysis: TAnalysis) => {
      analysisStore.set(userAnalysisListAtom, [analysis, ...userAnalysis]);
    },
    [userAnalysis],
  );

  return { injectAnalysis };
};
