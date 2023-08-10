import { Text, TextProps } from '@chakra-ui/react';
import { CONSTITUENT_DATA_ATTRS } from '@/features/syntax-editor';

interface TokenProps extends TextProps {
  token: string;
  index: number;
}

export default function Token({ token, index, ...textProps }: TokenProps) {
  const dataAttrs = { [CONSTITUENT_DATA_ATTRS.TOKEN_INDEX]: index };

  return (
    <Text position="relative" as="span" {...dataAttrs} {...textProps}>
      {token}
    </Text>
  );
}
