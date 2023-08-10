import { useLocation, useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  analysisListBySourceAtom,
  AnalysisPathParams,
  selectedAnalysisAtom,
  userAnalysisListAtom,
} from '@/features/syntax-editor';
import { useCallback, useEffect, useRef } from 'react';

export default function useAnalysisDataLoader() {
  const { source, index } = useParams<AnalysisPathParams>();
  const location = useLocation();
  const isProcessed = useRef(false);

  const analysisListBySource = useAtomValue(analysisListBySourceAtom);
  const setUserAnalysisList = useSetAtom(userAnalysisListAtom);
  const setSelectedAnalysis = useSetAtom(selectedAnalysisAtom);

  const loadAndSetAnalysisFromState = useCallback(() => {
    const analysis = location.state?.analysis;
    if (!analysis) return;

    setUserAnalysisList((prev) => [analysis, ...prev]);
    setSelectedAnalysis(analysis);
    isProcessed.current = true;
  }, [location.state, setSelectedAnalysis, setUserAnalysisList]);

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

    loadAndSetAnalysisFromState();
    loadAndSetAnalysisBySource();
  }, [loadAndSetAnalysisFromState, loadAndSetAnalysisBySource]);
}
