import { HStack, StackProps, Text, VStack } from '@chakra-ui/react';
import { DateChip, DeleteIconButton } from '@/components/common';
import { tokenJoiner } from '@/utils/string';
import React from 'react';

interface DeletableSentenceProps extends StackProps {
  onClick: () => void;
  onDelete: () => void;
  hideDeleteButton?: boolean;
  sentence: string[] | string;
  createdAt: string;
}

export default function DeletableSentence({
  onClick,
  sentence,
  createdAt,
  onDelete,
  hideDeleteButton = false,
  ...stackProps
}: DeletableSentenceProps) {
  return (
    <VStack align="start" gap={0} p={1.5} {...stackProps}>
      <HStack w="full" justify="space-between">
        <DateChip date={createdAt} h={5} />
        <DeleteIconButton
          onConfirm={onDelete}
          hidden={hideDeleteButton}
          popoverHeader="선택한 문장을 삭제하시겠습니까?"
        />
      </HStack>
      <Text
        noOfLines={1}
        cursor="pointer"
        _hover={{ color: 'blue.300' }}
        onClick={onClick}
      >
        {typeof sentence === 'string' ? sentence : tokenJoiner(sentence)}
      </Text>
    </VStack>
  );
}
