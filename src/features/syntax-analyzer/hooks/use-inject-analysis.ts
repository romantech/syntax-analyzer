import { useCallback } from 'react';

import { useLocalStorage } from '@/base';
import { analysisStore, userAnalysisListAtom } from '@/features/syntax-editor/store/analysis-store';
import type { TAnalysis } from '@/features/syntax-editor/types/analysis';

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
