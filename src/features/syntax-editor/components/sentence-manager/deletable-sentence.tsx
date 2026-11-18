import {
  Badge,
  Button,
  HStack,
  type StackProps,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverColor = useColorModeValue('teal.700', 'teal.300');
  const sentenceText = typeof sentence === 'string' ? sentence : tokenJoiner(sentence);

  return (
    <HStack align="start" p={1.5} {...stackProps}>
      <VStack align="stretch" flex={1} minW={0} gap={0.5}>
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
        <Button
          variant="unstyled"
          display="block"
          w="fit-content"
          maxW="full"
          minW={0}
          h="auto"
          minH={6}
          textAlign="start"
          fontWeight="normal"
          lineHeight="base"
          _hover={{ color: hoverColor }}
          _focusVisible={{ outline: '2px solid', outlineOffset: '-2px' }}
          onClick={onClick}
        >
          <Text as="span" noOfLines={1}>
            {sentenceText}
          </Text>
        </Button>
      </VStack>
      {!hideDeleteButton && (
        <DeleteButtonIcon
          aria-label={`문장 삭제: ${sentenceText}`}
          onClick={onOpen}
          boxSize={{ base: '2.75rem', lg: 8 }}
          flexShrink={0}
        />
      )}
      <ConfirmModal
        isOpen={isOpen}
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
