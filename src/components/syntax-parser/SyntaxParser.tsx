import { SlideFade } from '@chakra-ui/react';
import { useRef } from 'react';
import '@/styles/constituent.scss';
import { useCalculateNestingLevel, useSyntaxParserAnalysis } from '@/hooks';
import TokenList from './TokenList';
import Sentence from './Sentence';
import SegmentList from './SegmentList';
import { TextPlaceholder } from '@/components';
import { TbMoodEmpty } from 'react-icons/tb';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const isNestingLevelCalculated = useCalculateNestingLevel(sentenceRef);
  const { segment, sentence } = useSyntaxParserAnalysis();

  if (!segment || !sentence) {
    return (
      <TextPlaceholder
        fontSize="3xl"
        fontWeight="bold"
        pl={4}
        text="선택한 문장이 없어요"
        endIcon={TbMoodEmpty}
      />
    );
  }

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
