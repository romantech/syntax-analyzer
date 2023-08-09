import { useAtomValue } from 'jotai';
import { currentAnalysisAtom, currentHistorySegmentAtom } from '@/store';

export default function useSyntaxParserAnalysis() {
  const sentence = useAtomValue(currentAnalysisAtom)?.sentence ?? null;
  const segment = useAtomValue(currentHistorySegmentAtom);
  return { sentence, segment };
}
