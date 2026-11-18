import {
  Button,
  Highlight,
  SlideFade,
  StackDivider,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useIsFetching } from '@tanstack/react-query';

import { RANDOM_SENTENCE_BASE_KEY } from '@/features/syntax-analyzer';
import { COPY_SENTENCE_SUCCESS_TOAST_DURATION } from '@/features/syntax-editor';

interface RandomSentenceListProps {
  data?: string[];
  query: string[];
}

export default function RandomSentenceList({ data, query }: RandomSentenceListProps) {
  const toast = useToast();
  const highlightColor = useColorModeValue('teal.700', 'teal.300');
  const isFetching = useIsFetching({ queryKey: RANDOM_SENTENCE_BASE_KEY });
  const copySentence = async (sentence: string) => {
    try {
      await navigator.clipboard.writeText(sentence);
      toast({
        title: '클립보드에 복사되었습니다',
        status: 'success',
        duration: COPY_SENTENCE_SUCCESS_TOAST_DURATION,
      });
    } catch {
      toast({ title: '문장을 복사할 수 없어요', status: 'error' });
    }
  };

  return (
    <SlideFade in={Boolean(data) && !isFetching} offsetY="20px">
      <VStack align="stretch" spacing={0} maxH="190px" overflowY="auto" divider={<StackDivider />}>
        {data?.map((sentence) => (
          <Button
            key={sentence}
            aria-label={`문장 복사: ${sentence}`}
            variant="unstyled"
            display="block"
            flexShrink={0}
            h="auto"
            minH="2.75rem"
            px={2}
            py={{ base: 2.5, lg: 1 }}
            textAlign="start"
            whiteSpace="normal"
            overflowWrap="anywhere"
            fontWeight="normal"
            fontStyle="italic"
            lineHeight="tall"
            _hover={{ textDecoration: 'underline' }}
            _focusVisible={{ outline: '2px solid', outlineOffset: '-2px' }}
            onClick={() => copySentence(sentence)}
          >
            <Highlight query={query} styles={{ color: highlightColor, fontWeight: 'bold' }}>
              {sentence}
            </Highlight>
          </Button>
        ))}
      </VStack>
    </SlideFade>
  );
}
