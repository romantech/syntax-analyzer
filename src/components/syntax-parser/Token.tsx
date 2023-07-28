import { Text } from '@chakra-ui/react';

interface TokenProps {
  token: string;
  padding: number[];
  index: number;
}

export default function Token({ token, padding, index }: TokenProps) {
  return (
    <Text
      position="relative"
      as="span"
      p={padding}
      zIndex={1}
      data-token-index={index}
    >
      {token}
    </Text>
  );
}
