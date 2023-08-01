import { As, Icon, Text, TextProps } from '@chakra-ui/react';
import React from 'react';

interface TextPlaceholderProps extends TextProps {
  text: string;
  startIcon?: As;
  endIcon?: As;
}

export default function TextPlaceholder({
  text,
  startIcon,
  endIcon,
  ...textProps
}: TextPlaceholderProps) {
  return (
    <Text display="flex" gap={2} alignItems="center" {...textProps}>
      {startIcon && <Icon as={startIcon} />}
      {text}
      {endIcon && <Icon as={endIcon} />}
    </Text>
  );
}
