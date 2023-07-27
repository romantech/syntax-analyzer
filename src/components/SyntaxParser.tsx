import { Segments, TokenList } from '@/components';
import { SlideFade, Text, useColorModeValue } from '@chakra-ui/react';
import { useRef } from 'react';
import '@/styles/constituent.scss';
import { useCalculateNestingLevel, useSegmentHandler } from '@/hooks';
import { useAtomValue } from 'jotai';
import { deleteModeAtom } from '@/store/controlPanelStore.ts';
import { Analysis } from '@/types/analysis';

interface SyntaxParserProps {
  rootSegment: Analysis['rootSegment'];
  sentence: Analysis['sentence'];
}

export default function SyntaxParser({
  rootSegment,
  sentence,
}: SyntaxParserProps) {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const isDeleteMode = useAtomValue(deleteModeAtom);
  const isNestingLevelCalculated = useCalculateNestingLevel(sentenceRef);
  const handlers = useSegmentHandler();
  const textColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <SlideFade in={isNestingLevelCalculated} offsetY={100}>
      <Text
        fontSize="3xl"
        fontWeight="bold"
        ref={sentenceRef}
        whiteSpace="nowrap"
        color={textColor}
        cursor={isDeleteMode ? 'pointer' : 'text'}
        {...handlers}
      >
        <Segments
          segment={rootSegment}
          tokenElements={TokenList({ sentence })}
        />
      </Text>
    </SlideFade>
  );
}
