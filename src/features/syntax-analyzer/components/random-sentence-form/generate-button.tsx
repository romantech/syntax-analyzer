import {
  MAX_SENTENCE_COUNT,
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

  return (
    <Button
      w={191}
      onClick={onClick}
      leftIcon={<RiAiGenerate />}
      textTransform="uppercase"
      isLoading={isLoading}
      isDisabled={count === 0}
      {...buttonProps}
    >
      <Text as="span">generate</Text>
      <Text
        pl={1}
        as="span"
        color={useColorModeValue('gray.400', 'gray.500')}
        fontSize="sm"
      >{`(${count}/${MAX_SENTENCE_COUNT})`}</Text>
    </Button>
  );
}

const GenerateButtonSkeleton = () => {
  return <Skeleton w={191} h={39} borderRadius="md" />;
};

GenerateButton.Skeleton = GenerateButtonSkeleton;
