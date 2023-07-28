import { Segments, TokenList } from '@/components';
import { SlideFade, Text, useColorModeValue } from '@chakra-ui/react';
import { forwardRef, PropsWithChildren, useRef } from 'react';
import '@/styles/constituent.scss';
import { useCalculateNestingLevel, useSentenceHandlers } from '@/hooks';
import { useAtomValue } from 'jotai';
import { deleteModeAtom } from '@/store/controlPanelStore.ts';
import { currentSegmentAtom } from '@/store/segmentHistoryStore.ts';
import { currentSentenceAtom } from '@/store/analysisStore.ts';

const RootSegment = () => {
  const segment = useAtomValue(currentSegmentAtom);
  const sentence = useAtomValue(currentSentenceAtom);
  const hasAnalysisData = segment && sentence;
  if (!hasAnalysisData) return null;

  return <Segments segment={segment} tokenElements={TokenList({ sentence })} />;
};

const Sentence = forwardRef<HTMLParagraphElement, PropsWithChildren>(
  ({ children }, ref) => {
    const isDeleteMode = useAtomValue(deleteModeAtom);
    const handlers = useSentenceHandlers();
    const textColor = useColorModeValue('gray.700', 'gray.300');
    return (
      <Text
        fontSize="3xl"
        fontWeight="bold"
        ref={ref}
        whiteSpace="nowrap"
        color={textColor}
        cursor={isDeleteMode ? 'pointer' : 'text'}
        {...handlers}
      >
        {children}
      </Text>
    );
  },
);
Sentence.displayName = 'Sentence';

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
