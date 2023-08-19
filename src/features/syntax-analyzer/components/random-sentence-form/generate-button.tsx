import {
  MAX_SENTENCE_COUNT,
  UsageLimitTooltip,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';
import {
  Button,
  ButtonProps,
  Skeleton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';

export default function GenerateButton({
  onClick,
  isLoading,
  ...buttonProps
}: ButtonProps) {
  const { data: count = 0 } = useRemainingCountQuery({
    select: (data) => data.random_sentence,
    suspense: true,
  });
  const countColor = useColorModeValue('gray.400', 'gray.500');
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
          color={countColor}
          fontSize="sm"
        >{`(${count}/${MAX_SENTENCE_COUNT})`}</Text>
      </Button>
    </UsageLimitTooltip>
  );
}

const GenerateButtonSkeleton = () => {
  return <Skeleton minW={170} h={39} borderRadius="md" />;
};

GenerateButton.Skeleton = GenerateButtonSkeleton;
