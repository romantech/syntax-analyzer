import { Button, type ButtonProps, Skeleton, Stack, Text } from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';

import {
  DAILY_SENTENCE_LIMIT,
  UsageLimitMessage,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';

export default function GenerateButton({ onClick, loading, ...buttonProps }: ButtonProps) {
  const { data: count = 0 } = useRemainingCountQuery({
    select: (data) => data.random_sentence,
  });
  const hasCount = count > 0;

  return (
    <Stack align="start" maxW={190}>
      <Button
        minW={170}
        h={{ base: '2.75rem', lg: 12 }}
        fontSize="md"
        onClick={onClick}
        textTransform="uppercase"
        loading={loading}
        disabled={!hasCount}
        variant="subtle"
        {...buttonProps}
      >
        <RiAiGenerate />
        <Text as="span">문장 생성</Text>
        <Text
          pl={1}
          as="span"
          color="description"
          fontSize="sm"
        >{`(${count}/${DAILY_SENTENCE_LIMIT})`}</Text>
      </Button>
      {!hasCount && <UsageLimitMessage />}
    </Stack>
  );
}

const GenerateButtonSkeleton = () => {
  return <Skeleton minW={170} h={{ base: '2.75rem', lg: 12 }} borderRadius="md" />;
};

GenerateButton.Skeleton = GenerateButtonSkeleton;
