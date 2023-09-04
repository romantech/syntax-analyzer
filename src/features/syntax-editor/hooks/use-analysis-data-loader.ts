import { useCallback, useEffect, useRef } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { useParams } from 'react-router-dom';

import {
  analysisListBySourceAtom,
  AnalysisPathParams,
  selectedAnalysisAtom,
} from '@/features/syntax-editor';

export const useAnalysisDataLoader = () => {
  const { source, index } = useParams<AnalysisPathParams>();
  const isProcessed = useRef(false);

  const analysisListBySource = useAtomValue(analysisListBySourceAtom);
  const setSelectedAnalysis = useSetAtom(selectedAnalysisAtom);

  const loadAndSetAnalysisBySource = useCallback(() => {
    if (!source || !index) return;

    const selectedAnalysis = analysisListBySource[source][+index];
    if (selectedAnalysis) {
      setSelectedAnalysis(selectedAnalysis);
      isProcessed.current = true;
    }
  }, [analysisListBySource, setSelectedAnalysis, source, index]);

  useEffect(() => {
    if (isProcessed.current) return;
    loadAndSetAnalysisBySource();
  }, [loadAndSetAnalysisBySource]);
};
