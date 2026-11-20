import { HStack, type StackProps, Tag } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useFormContext, useWatch } from 'react-hook-form';

import type { RandomSentenceFormValues } from '@/features/syntax-analyzer';

export default function TopicTagList(stackProps: StackProps) {
  const { control, setValue } = useFormContext<RandomSentenceFormValues>();
  const topics = useWatch({ name: 'topics', control });
  const [parent] = useAutoAnimate({ duration: 200 });

  const onTagClick = (keyword: string) => {
    const filteredTopics = topics.filter((topic) => topic !== keyword);
    setValue('topics', filteredTopics);
  };

  /** Wrap 컴포넌트 사용시 useAutoAnimate 작동 안함 */
  return (
    <HStack flexWrap="wrap" {...stackProps} ref={parent}>
      {topics.map((topic) => (
        <Tag.Root
          size="md"
          key={topic}
          h={6}
          my={{ base: 2.5, lg: 0 }}
          pl={3}
          pr={0}
          borderRadius="md"
          variant="subtle"
          colorPalette="teal"
          _dark={{ bg: '#286769', color: '#cce3eb' }}
        >
          <Tag.Label
            maxW="5.5rem"
            truncate
            title={topic}
            fontWeight="semibold"
            textTransform="uppercase"
          >
            {topic}
          </Tag.Label>
          <Tag.CloseTrigger
            aria-label={`${topic} 토픽 삭제`}
            w={{ base: '2.75rem', lg: 8 }}
            h={{ base: '2.75rem', lg: 6 }}
            flexShrink={0}
            cursor="pointer"
            _icon={{ boxSize: 3.5 }}
            onClick={() => onTagClick(topic)}
          />
        </Tag.Root>
      ))}
    </HStack>
  );
}
