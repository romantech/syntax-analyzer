import { SlideFade } from '@chakra-ui/react';
import { useRef } from 'react';
import '@/styles/constituent.scss';
import { useCalculateNestingLevel } from '@/hooks';

import { useAtomValue } from 'jotai';
import { currentSegmentAtom } from '@/store/segmentHistoryStore';
import { currentSentenceAtom } from '@/store/analysisStore';
import TokenList from './TokenList';
import Sentence from './Sentence';
import SegmentList from './SegmentList';

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
