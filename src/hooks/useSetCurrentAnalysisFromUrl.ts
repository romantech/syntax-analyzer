import { useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  analysisListBySourceAtom,
  currentAnalysisAtom,
} from '@/store/analysisStore';
import { useEffect } from 'react';
import { AnalysisParams } from '@/types/analysis';

export default function useSetCurrentAnalysisFromUrl() {
  const { source, index } = useParams<AnalysisParams>();
  const analysisListBySource = useAtomValue(analysisListBySourceAtom);
  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);

  useEffect(() => {
    if (source && index) {
      const currentAnalysis = analysisListBySource[source][+index];
      if (currentAnalysis) setCurrentAnalysis(currentAnalysis);
    }
  }, [analysisListBySource, setCurrentAnalysis, source, index]);
}
