import { Badge, HStack, StackProps, Text, VStack } from '@chakra-ui/react';
import {
  ConfirmPopover,
  DateChip,
  DeleteButtonIcon,
  isLessThanAgo,
  tokenJoiner,
} from '@/base';

import { NEW_BADGE_DISPLAY_DURATION } from '@/features/syntax-editor';

interface DeletableSentenceProps extends StackProps {
  onClick: () => void;
  onDelete: () => void;
  hideDeleteButton?: boolean;
  sentence: string[] | string;
  showGPTBadge: boolean;
  createdAt: string;
}

export default function DeletableSentence({
  onClick,
  sentence,
  createdAt,
  onDelete,
  showGPTBadge,
  hideDeleteButton = false,
  ...stackProps
}: DeletableSentenceProps) {
  return (
    <VStack align="start" gap={0.5} p={1.5} {...stackProps}>
      <HStack w="full" justify="space-between">
        <HStack gap={1.5}>
          <DateChip date={createdAt} h={5} />
          {isLessThanAgo(createdAt, NEW_BADGE_DISPLAY_DURATION) && (
            <Badge fontSize="8px" colorScheme="teal">
              New
            </Badge>
          )}
          {showGPTBadge && (
            <Badge fontSize="8px" colorScheme="orange">
              GPT
            </Badge>
          )}
        </HStack>
        <ConfirmPopover
          headerText="선택한 문장을 삭제하시겠습니까?"
          onConfirm={onDelete}
          confirmText="삭제"
        >
          {({ onOpen }) => (
            <DeleteButtonIcon onClick={onOpen} hidden={hideDeleteButton} />
          )}
        </ConfirmPopover>
      </HStack>
      <Text
        noOfLines={1}
        cursor="pointer"
        _hover={{ color: 'teal.300' }}
        onClick={onClick}
      >
        {typeof sentence === 'string' ? sentence : tokenJoiner(sentence)}
      </Text>
    </VStack>
  );
}
