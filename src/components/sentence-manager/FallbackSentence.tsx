import { Icon, Text, TextProps } from '@chakra-ui/react';
import { TbMoodEmpty } from 'react-icons/tb';
import React from 'react';

export default function FallbackSentence({ ...textProps }: TextProps) {
  return (
    <Text display="flex" alignItems="center" {...textProps}>
      아직 추가한 문장이 없어요
      <Icon as={TbMoodEmpty} />
    </Text>
  );
}
