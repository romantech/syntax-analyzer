import {
  HStack,
  StackProps,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { RandomSentenceFormValues } from '@/features/syntax-analyzer';

export default function Topics(stackProps: StackProps) {
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
        <Tag
          size="sm"
          key={topic}
          borderRadius="md"
          variant="solid"
          colorScheme="teal"
        >
          <TagLabel w="fit" textTransform="uppercase">
            {topic}
          </TagLabel>
          <TagCloseButton onClick={() => onTagClick(topic)} />
        </Tag>
      ))}
    </HStack>
  );
}
