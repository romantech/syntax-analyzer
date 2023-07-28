import { SlideFade } from '@chakra-ui/react';
import { useRef } from 'react';
import '@/styles/constituent.scss';
import { useCalculateNestingLevel } from '@/hooks';
import { RootSegment, Sentence } from '@/components/syntax-parser';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const isNestingLevelCalculated = useCalculateNestingLevel(sentenceRef);

  return (
    <SlideFade in={isNestingLevelCalculated} offsetY={100}>
      <Sentence ref={sentenceRef}>
        <RootSegment />
      </Sentence>
    </SlideFade>
  );
}
