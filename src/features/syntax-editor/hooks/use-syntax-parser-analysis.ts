import { useAtomValue } from 'jotai';
import {
  currentSegmentFromHistoryAtom,
  selectedAnalysisAtom,
} from '@/features/syntax-editor';

export const useSyntaxParserAnalysis = () => {
  const sentence = useAtomValue(selectedAnalysisAtom)?.sentence ?? null;
  const segment = useAtomValue(currentSegmentFromHistoryAtom);
  return { sentence, segment };
};
