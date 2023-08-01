import { useAtomValue } from 'jotai';
import { currentAnalysisAtom } from '@/store/analysisStore';
import { currentHistorySegmentAtom } from '@/store/segmentHistoryStore';

export default function useSyntaxParserAnalysis() {
  const sentence = useAtomValue(currentAnalysisAtom)?.sentence;
  const segment = useAtomValue(currentHistorySegmentAtom);
  return { sentence, segment };
}
