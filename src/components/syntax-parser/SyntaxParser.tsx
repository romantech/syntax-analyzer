import { startTransition, useEffect, useRef, useState } from 'react';
import { useCalculateNestingLevel, useSyntaxParserAnalysis } from '@/hooks';
import { SlideFade, Spinner } from '@chakra-ui/react';
import TokenList from '@/components/syntax-parser/TokenList';
import Sentence from '@/components/syntax-parser/Sentence';
import SegmentList from '@/components/syntax-parser/SegmentList';
import { TbMoodEmpty } from 'react-icons/tb';
import { TextPlaceholder } from '@/components';
import '@/styles/constituent.scss';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const { segment, sentence } = useSyntaxParserAnalysis();
  const noData = !segment || !sentence;

  const [isLoading, setIsLoading] = useState(true);
  const isNestingLevelCalculated = useCalculateNestingLevel({
    targetRef: sentenceRef,
    trigger: isLoading,
  });

  useEffect(() => {
    startTransition(() => setIsLoading(false));
  }, [noData]);

  if (isLoading) return <Spinner size="md" thickness="3px" color="blue.300" />;

  if (noData) {
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
