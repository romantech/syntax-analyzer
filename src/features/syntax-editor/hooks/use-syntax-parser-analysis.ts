import { useAtomValue } from 'jotai';
import {
  currentAnalysisAtom,
  currentSegmentFromHistoryAtom,
} from '@/features/syntax-editor';

export default function useSyntaxParserAnalysis() {
  const sentence = useAtomValue(currentAnalysisAtom)?.sentence ?? null;
  const segment = useAtomValue(currentSegmentFromHistoryAtom);
  return { sentence, segment };
}
