import { useAtomValue } from 'jotai';
import { currentSegmentAtom } from '@/store/segmentHistoryStore';
import { currentSentenceAtom } from '@/store/analysisStore';
import { SegmentList, TokenList } from '@/components/syntax-parser';

export default function RootSegment() {
  const segment = useAtomValue(currentSegmentAtom);
  const sentence = useAtomValue(currentSentenceAtom);
  const hasAnalysisData = segment && sentence;
  if (!hasAnalysisData) return null;

  return (
    <SegmentList segment={segment} tokenElements={TokenList({ sentence })} />
  );
}
