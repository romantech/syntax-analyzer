import { Button, ButtonProps, Skeleton, Text } from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';

import {
  DAILY_SENTENCE_LIMIT,
  UsageLimitTooltip,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';

export default function GenerateButton({
  onClick,
  isLoading,
  ...buttonProps
}: ButtonProps) {
  const { data: count = 0 } = useRemainingCountQuery({
    select: (data) => data.random_sentence,
    suspense: true,
  });
  const hasCount = count > 0;

  return (
    <UsageLimitTooltip isDisabled={hasCount}>
      <Button
        minW={170}
        onClick={onClick}
        leftIcon={<RiAiGenerate />}
        textTransform="uppercase"
        isLoading={isLoading}
        isDisabled={!hasCount}
        {...buttonProps}
      >
        <Text as="span">문장 생성</Text>
        <Text
          pl={1}
          as="span"
          color="description"
          fontSize="sm"
        >{`(${count}/${DAILY_SENTENCE_LIMIT})`}</Text>
      </Button>
    </UsageLimitTooltip>
  );
}

const GenerateButtonSkeleton = () => {
  return <Skeleton minW={170} h={39} borderRadius="md" />;
};

GenerateButton.Skeleton = GenerateButtonSkeleton;
