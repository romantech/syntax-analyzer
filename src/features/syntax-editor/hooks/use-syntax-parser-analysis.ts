import { useAtomValue } from 'jotai';
import {
  currentSegmentFromHistoryAtom,
  selectedAnalysisAtom,
} from '@/features/syntax-editor';

export default function useSyntaxParserAnalysis() {
  const sentence = useAtomValue(selectedAnalysisAtom)?.sentence ?? null;
  const segment = useAtomValue(currentSegmentFromHistoryAtom);
  return { sentence, segment };
}
