import { SlideFade } from '@chakra-ui/react';
import { useRef } from 'react';
import '@/styles/constituent.scss';
import { useCalculateNestingLevel } from '@/hooks';
import { SegmentList, Sentence, TokenList } from '@/components/syntax-parser';
import { useAtomValue } from 'jotai/index';
import { currentSegmentAtom } from '@/store/segmentHistoryStore';
import { currentSentenceAtom } from '@/store/analysisStore';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const isNestingLevelCalculated = useCalculateNestingLevel(sentenceRef);

  const segment = useAtomValue(currentSegmentAtom);
  const sentence = useAtomValue(currentSentenceAtom);
  const hasAnalysisData = segment && sentence;
  if (!hasAnalysisData) return null;

  return (
    <SlideFade in={isNestingLevelCalculated} offsetY={100}>
      <Sentence ref={sentenceRef}>
        <SegmentList
          segment={segment}
          tokenElements={TokenList({ sentence })}
        />
      </Sentence>
    </SlideFade>
  );
}
