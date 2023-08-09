import { useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { analysisListBySourceAtom, currentAnalysisAtom } from '@/store';
import { useEffect } from 'react';

import { AnalysisPathParams } from '@/features/syntax-editor';

export default function useLoadAnalysisFromUrl() {
  const { source, index } = useParams<AnalysisPathParams>();
  const analysisListBySource = useAtomValue(analysisListBySourceAtom);
  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);

  useEffect(() => {
    if (source && index) {
      const currentAnalysis = analysisListBySource[source][+index];
      if (currentAnalysis) setCurrentAnalysis(currentAnalysis);
    }
  }, [analysisListBySource, setCurrentAnalysis, source, index]);
}
