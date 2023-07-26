import { sampleData } from '@/constants/dummy.ts';
import { Segments, TokenList } from '@/components';
import { SlideFade, Text, useColorModeValue } from '@chakra-ui/react';
import { useRef } from 'react';
import '@/styles/constituent.scss';
import useCalculateNestingLevel from '../hooks/useCalculateNestingLevel.ts';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const isNestingLevelCalculated = useCalculateNestingLevel(sentenceRef);
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const { rootSegment, sentence } = sampleData;

  return (
    <SlideFade in={isNestingLevelCalculated} offsetY={100}>
      <Text
        fontSize="3xl"
        fontWeight="bold"
        ref={sentenceRef}
        whiteSpace="nowrap"
        color={textColor}
      >
        <Segments
          key={rootSegment.id}
          segment={rootSegment}
          tokenElements={TokenList({ sentence })}
        />
      </Text>
    </SlideFade>
  );
}
