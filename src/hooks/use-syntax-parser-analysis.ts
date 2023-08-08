import { useAtomValue } from 'jotai';
import { currentAnalysisAtom } from '@/store/analysis-store';
import { currentHistorySegmentAtom } from '@/store/segment-history-store';

export default function useSyntaxParserAnalysis() {
  const sentence = useAtomValue(currentAnalysisAtom)?.sentence ?? null;
  const segment = useAtomValue(currentHistorySegmentAtom);
  return { sentence, segment };
}
