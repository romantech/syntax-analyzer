import { useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  combinedAnalysisMapAtom,
  currentAnalysisAtom,
} from '@/store/analysisStore';

export default function useSetCurrentAnalysisFromUrl() {
  const { id } = useParams();
  const combinedAnalysisMap = useAtomValue(combinedAnalysisMapAtom);
  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);
  if (!id) return;

  const foundAnalysis = combinedAnalysisMap[id];
  if (foundAnalysis) setCurrentAnalysis(foundAnalysis);
}
