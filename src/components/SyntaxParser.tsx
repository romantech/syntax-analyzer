import { sampleData } from '@/constants/dummy.ts';
import { Segments, Tokens } from '@/components';
import { Text } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { calculateNestingLevel } from '@/utils/nestingLevelCalculators.ts';
import '@/styles/constituent.scss';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const { rootSegment, sentence } = sampleData;

  useEffect(() => {
    if (sentenceRef.current) calculateNestingLevel(sentenceRef);
  }, []);

  return (
    <Text fontSize="4xl" ref={sentenceRef}>
      <Segments
        key={rootSegment.id}
        segment={rootSegment}
        tokenElements={Tokens({ sentence })}
      />
    </Text>
  );
}
