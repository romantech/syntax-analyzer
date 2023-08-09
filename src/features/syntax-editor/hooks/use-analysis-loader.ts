import { useLocation, useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  analysisListBySourceAtom,
  currentAnalysisAtom,
  userAnalysisListAtom,
} from '@/store';
import { useCallback, useEffect, useRef } from 'react';

import { AnalysisPathParams } from '@/features/syntax-editor';

export default function useAnalysisLoader() {
  console.log('effect');
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
