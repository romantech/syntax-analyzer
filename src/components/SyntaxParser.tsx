import { sampleData } from '@/constants/dummy.ts';
import { Segments, Token } from '@/components/index.ts';
import { Text } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { calculateNestingLevel } from '@/utils/nestingLevelCalculators.ts';
import '@/styles/constituent.scss';

const Tokens = sampleData.sentence.map((token, i) => (
  <Token token={token} key={i} index={i} isFirst={i === 0} />
));

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const { rootSegment } = sampleData;

  useEffect(() => {
    if (sentenceRef.current) calculateNestingLevel(sentenceRef);
  }, []);

  return (
    <Text fontSize="4xl" ref={sentenceRef}>
      <Segments
        key={rootSegment.id}
        segment={rootSegment}
        tokenElements={Tokens}
      />
    </Text>
  );
}
