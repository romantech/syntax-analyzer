import { Badge, Button, HStack, Stack, type StackProps, useDisclosure } from '@chakra-ui/react';
import { useId } from 'react';

import { ConfirmModal, DateChip, DeleteButtonIcon, isLessThanAgo, tokenJoiner } from '@/base';
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
  const { open, onOpen, onClose } = useDisclosure();
  const metadataId = useId();
  const sentenceText = typeof sentence === 'string' ? sentence : tokenJoiner(sentence);

  return (
    <HStack align="start" gap={0} {...stackProps}>
      <Stack flex={1} align="start" gap={0.5} minW={0} px={1.5} py={3.5}>
        <HStack as="span" id={metadataId} gap={1.5}>
          <DateChip date={createdAt} h={5} />
          {isLessThanAgo(createdAt, NEW_BADGE_DISPLAY_DURATION) && (
            <Badge fontSize="8px" colorPalette="teal">
              New
            </Badge>
          )}
          {showGPTBadge && (
            <Badge fontSize="8px" colorPalette="orange">
              GPT
            </Badge>
          )}
        </HStack>
        <Button
          aria-label={sentenceText}
          aria-describedby={metadataId}
          variant="plain"
          borderRadius="none"
          display="block"
          maxW="full"
          truncate
          textAlign="start"
          fontWeight="normal"
          lineHeight="base"
          cursor="pointer"
          _hover={{ color: 'teal.fg' }}
          onClick={onClick}
        >
          {sentenceText}
        </Button>
      </Stack>
      {!hideDeleteButton && (
        <DeleteButtonIcon
          aria-label={`문장 삭제: ${sentenceText}`}
          onClick={onOpen}
          boxSize={{ base: '2.75rem', lg: 8 }}
          flexShrink={0}
          mt={3.5}
          me={1.5}
        />
      )}
      <ConfirmModal
        isOpen={open}
        onClose={onClose}
        onConfirm={() => {
          onClose();
          onDelete();
        }}
        headerContent="문장 삭제"
        bodyContent="선택한 문장을 삭제하시겠습니까?"
      />
    </HStack>
  );
}
