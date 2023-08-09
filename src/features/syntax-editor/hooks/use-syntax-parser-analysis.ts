import { useAtomValue } from 'jotai';
import {
  currentAnalysisAtom,
  currentHistorySegmentAtom,
} from '@/features/syntax-editor';

export default function useSyntaxParserAnalysis() {
  const sentence = useAtomValue(currentAnalysisAtom)?.sentence ?? null;
  const segment = useAtomValue(currentHistorySegmentAtom);
  return { sentence, segment };
}
