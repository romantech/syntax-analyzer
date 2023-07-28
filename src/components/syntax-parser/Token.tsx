import { Text } from '@chakra-ui/react';

interface TokenProps {
  token: string;
  padding: number[];
}

export default function Token({ token, padding }: TokenProps) {
  return (
    <Text position="relative" as="span" p={padding} zIndex={1}>
      {token}
    </Text>
  );
}
