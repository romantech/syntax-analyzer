import { useLocation, useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  analysisListBySourceAtom,
  AnalysisPathParams,
  currentAnalysisAtom,
  userAnalysisListAtom,
} from '@/features/syntax-editor';
import { useCallback, useEffect, useRef } from 'react';

export default function useAnalysisLoader() {
  const { source, index } = useParams<AnalysisPathParams>();
  const location = useLocation();
  const isProcessed = useRef(false);

  const analysisListBySource = useAtomValue(analysisListBySourceAtom);
  const setUserAnalysisList = useSetAtom(userAnalysisListAtom);
  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);

  const loadAndSetAnalysisFromState = useCallback(() => {
    const analysis = location.state?.analysis;
    if (!analysis) return;

    setUserAnalysisList((prev) => [analysis, ...prev]);
    setCurrentAnalysis(analysis);
  }, [location.state, setCurrentAnalysis, setUserAnalysisList]);

  const loadAndSetAnalysisBySource = useCallback(() => {
    if (!source || !index) return;

    const currentAnalysis = analysisListBySource[source][+index];
    if (currentAnalysis) setCurrentAnalysis(currentAnalysis);
  }, [analysisListBySource, setCurrentAnalysis, source, index]);

  useEffect(() => {
    if (isProcessed.current) return;

    loadAndSetAnalysisFromState();
    loadAndSetAnalysisBySource();

    isProcessed.current = true;
  }, [loadAndSetAnalysisFromState, loadAndSetAnalysisBySource]);
}
