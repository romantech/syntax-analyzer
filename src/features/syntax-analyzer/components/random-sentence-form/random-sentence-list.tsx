import { Button, Highlight, Presence, StackSeparator, VStack } from '@chakra-ui/react';
import { useIsFetching } from '@tanstack/react-query';

import { RANDOM_SENTENCE_BASE_KEY } from '@/features/syntax-analyzer';
import { COPY_SENTENCE_SUCCESS_TOAST_DURATION } from '@/features/syntax-editor/constants/settings';
import { showToast } from '@/lib';

interface RandomSentenceListProps {
  data?: string[];
  query: string[];
}

export default function RandomSentenceList({ data, query }: RandomSentenceListProps) {
  const isFetching = useIsFetching({ queryKey: RANDOM_SENTENCE_BASE_KEY });
  const copySentence = async (sentence: string) => {
    try {
      await navigator.clipboard.writeText(sentence);
      showToast({
        title: '클립보드에 복사되었습니다',
        status: 'success',
        duration: COPY_SENTENCE_SUCCESS_TOAST_DURATION,
      });
    } catch {
      showToast({ title: '문장을 복사할 수 없어요', status: 'error' });
    }
  };

  return (
    <Presence
      present={Boolean(data) && !isFetching}
      animationName={{ _open: 'fade-in, slide-from-bottom', _closed: 'fade-out, slide-to-bottom' }}
      animationDuration="moderate"
      css={{ '--slide-from-bottom-distance': '20px', '--slide-to-bottom-distance': '20px' }}
      _motionReduce={{ animationName: 'none' }}
    >
      <VStack
        align="stretch"
        gap={0}
        maxH="190px"
        overflowY="auto"
        separator={<StackSeparator _dark={{ opacity: 0.85 }} />}
      >
        {data?.map((sentence) => (
          <Button
            key={sentence}
            aria-label={`문장 복사: ${sentence}`}
            variant="plain"
            borderRadius="none"
            display="block"
            flexShrink={0}
            h="auto"
            minH={11}
            px={2}
            py={{ base: 2.5, lg: 1 }}
            textAlign="start"
            whiteSpace="normal"
            overflowWrap="anywhere"
            fontWeight="normal"
            fontStyle="italic"
            lineHeight="tall"
            _hover={{ color: 'teal.fg' }}
            focusRingOffset="-2px"
            css={{
              '& mark': { color: 'teal.fg', fontWeight: 'bold' },
            }}
            onClick={() => copySentence(sentence)}
          >
            <span lang="en">
              <Highlight query={query}>{sentence}</Highlight>
            </span>
          </Button>
        ))}
      </VStack>
    </Presence>
  );
}
