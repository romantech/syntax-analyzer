import { useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  combinedAnalysisMapAtom,
  currentAnalysisAtom,
} from '@/store/analysisStore';
import { useEffect } from 'react';

export default function useSetCurrentAnalysisFromUrl() {
  const { id } = useParams();
  const combinedAnalysisMap = useAtomValue(combinedAnalysisMapAtom);
  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);

  useEffect(() => {
    if (id) {
      const foundAnalysis = combinedAnalysisMap[id];
      if (foundAnalysis) setCurrentAnalysis(foundAnalysis);
    }
  }, [id, combinedAnalysisMap, setCurrentAnalysis]);
}
