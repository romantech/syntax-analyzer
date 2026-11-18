import { Text } from '@chakra-ui/react';

export default function UsageLimitMessage() {
  return (
    <Text color="description" fontSize="sm">
      사용량을 모두 소진했어요. 내일 다시 시도해 주세요.
    </Text>
  );
}
