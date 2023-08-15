import {
  MAX_SENTENCE_COUNT,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';
import {
  Button,
  ButtonProps,
  Skeleton,
  Text,
  Tooltip,
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
    <Tooltip
      isDisabled={hasCount}
      label={'사용량을 모두 소진했어요\n내일 다시 시도해주세요'}
      placement="top"
      whiteSpace="pre-line"
    >
      <Button
        w={190}
        onClick={onClick}
        leftIcon={<RiAiGenerate />}
        textTransform="uppercase"
        isLoading={isLoading}
        isDisabled={!hasCount}
        {...buttonProps}
      >
        <Text as="span">generate</Text>
        <Text
          pl={1}
          as="span"
          color={countColor}
          fontSize="sm"
        >{`(${count}/${MAX_SENTENCE_COUNT})`}</Text>
      </Button>
    </Tooltip>
  );
}

const GenerateButtonSkeleton = () => {
  return <Skeleton w={190} h={39} borderRadius="md" />;
};

GenerateButton.Skeleton = GenerateButtonSkeleton;
