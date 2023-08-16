import {
  Highlight,
  SlideFade,
  StackDivider,
  Text,
  useClipboard,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useIsFetching } from '@tanstack/react-query';
import { RANDOM_SENTENCE_BASE_KEY } from '@/features/syntax-analyzer';
import { useEffect } from 'react';
import { COPY_SENTENCE_SUCCESS_TOAST_DURATION } from '@/features/syntax-editor';

interface RandomSentenceListProps {
  data?: string[];
  query: string[];
}

export default function RandomSentenceList({
  data,
  query,
}: RandomSentenceListProps) {
  const toast = useToast();
  const isFetching = useIsFetching({ queryKey: RANDOM_SENTENCE_BASE_KEY });
  const { onCopy, setValue, hasCopied } = useClipboard('', 1000);

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: '클립보드에 복사되었습니다',
        status: 'success',
        duration: COPY_SENTENCE_SUCCESS_TOAST_DURATION,
      });
    }
  }, [hasCopied, toast]);

  return (
    <SlideFade in={Boolean(data) && !isFetching} offsetY="20px">
      <VStack
        align="stretch"
        maxH="190px"
        overflowY="auto"
        divider={<StackDivider borderColor="gray.700" />}
      >
        {data?.map((sentence) => (
          <Text
            as="i"
            cursor="pointer"
            key={sentence}
            onMouseEnter={() => setValue(sentence)}
            onClick={onCopy}
          >
            <Highlight
              query={query}
              styles={{ color: 'teal.400', fontWeight: 'bold' }}
            >
              {sentence}
            </Highlight>
          </Text>
        ))}
      </VStack>
    </SlideFade>
  );
}
