import { SlideFade, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import '@/styles/constituent.scss';
import { useCalculateNestingLevel, useSyntaxParserAnalysis } from '@/hooks';
import TokenList from './TokenList';
import Sentence from './Sentence';
import SegmentList from './SegmentList';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const isNestingLevelCalculated = useCalculateNestingLevel(sentenceRef);
  const { segment, sentence } = useSyntaxParserAnalysis();

  if (!segment || !sentence) return <Text>선택한 문장이 없어요</Text>;

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
