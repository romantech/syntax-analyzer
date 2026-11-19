import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { type RefObject, useRef } from 'react';
import { FiChevronUp } from 'react-icons/fi';

import {
  applySelectedTagAtom,
  CONSTITUENT_TRANSLATIONS,
  deleteModeAtom,
  invalidRangeIndexAtom,
  selectedAnalysisAtom,
  selectedTagActionAtom,
  selectedTokenRangeAtom,
  TagListAccordion,
} from '@/features/syntax-editor';

import { EditorActions } from './control-panel';

export default function TapSelectionControls({
  sentenceRegionRef,
}: {
  sentenceRegionRef: RefObject<HTMLDivElement | null>;
}) {
  const [selectedTag, setSelectedTag] = useAtom(selectedTagActionAtom);
  const sentence = useAtomValue(selectedAnalysisAtom)?.sentence;
  const isDeleteMode = useAtomValue(deleteModeAtom);
  const [range, setRange] = useAtom(selectedTokenRangeAtom);
  const invalidIndex = useAtomValue(invalidRangeIndexAtom);
  const applyTag = useSetAtom(applySelectedTagAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const returnFocusRef = useRef<HTMLElement>(null);
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const begin = range ? Math.min(...range) : 0;
  const end = range ? Math.max(...range) + 1 : 0;
  const tagName = selectedTag && CONSTITUENT_TRANSLATIONS[selectedTag.label].ko;
  const focusSentence = () => sentenceRegionRef.current?.focus({ preventScroll: true });
  const cancelRange = () => {
    setRange(null);
    focusSentence();
  };

  return (
    <Stack
      as="section"
      aria-label="태깅 도구막대"
      position="sticky"
      bottom={0}
      zIndex="sticky"
      mx={-4}
      px={4}
      pt={2}
      pb="calc(var(--chakra-space-4) + env(safe-area-inset-bottom, 0px))"
      gap={2}
      bg={bg}
      borderTopWidth="1px"
      borderColor={borderColor}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && range && !isOpen) cancelRange();
      }}
    >
      <Text role="status" fontSize="sm" color="description" noOfLines={2} overflowWrap="anywhere">
        {isDeleteMode && '지울 태그의 약어를 탭하세요.'}
        {selectedTag &&
          (range
            ? `${begin + 1 === end ? end : `${begin + 1}~${end}`}번째 단어 · ${sentence?.slice(begin, end).join(' ')}`
            : '시작 단어를 탭하세요. 범위를 선택하려면 끝 단어도 탭하세요.')}
      </Text>
      <HStack>
        <Button
          flex={1}
          minW={0}
          minH="44px"
          px={3}
          justifyContent="space-between"
          variant="outline"
          rightIcon={<FiChevronUp />}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={tagName ? `태그 선택 (현재 ${tagName})` : '태그 선택'}
          isDisabled={!sentence}
          onClick={(event) => {
            returnFocusRef.current = event.currentTarget;
            onOpen();
          }}
        >
          <Text as="span" isTruncated>
            {selectedTag ? `${tagName} · ${selectedTag.abbreviation}` : '태그 선택'}
          </Text>
        </Button>
        <Button
          minH="44px"
          px={3}
          colorScheme="teal"
          isDisabled={!range}
          onClick={() => {
            applyTag(begin, end);
            focusSentence();
          }}
        >
          적용
        </Button>
        <Button minH="44px" px={3} isDisabled={!range} onClick={cancelRange}>
          선택 취소
        </Button>
      </HStack>
      {range && invalidIndex === end - 1 && (
        <Text role="alert" color="description" fontSize="sm">
          구/절은 서로 교차할 수 없어요
        </Text>
      )}
      <EditorActions isTapMode />
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" finalFocusRef={returnFocusRef}>
        <DrawerOverlay />
        <DrawerContent
          borderTopRadius="xl"
          maxH="85dvh"
          pl="env(safe-area-inset-left, 0px)"
          pr="env(safe-area-inset-right, 0px)"
          pb="env(safe-area-inset-bottom, 0px)"
        >
          <DrawerHeader pr={16}>태그 선택</DrawerHeader>
          <DrawerCloseButton
            aria-label="태그 선택 닫기"
            boxSize="44px"
            right="calc(var(--chakra-space-2) + env(safe-area-inset-right, 0px))"
          />
          <DrawerBody px={{ base: 3, sm: 6 }} overscrollBehavior="contain">
            <TagListAccordion
              onTagSelect={(tag) => {
                if (selectedTag?.elementId !== tag.elementId) setSelectedTag(tag);
                returnFocusRef.current = sentenceRegionRef.current;
                onClose();
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Stack>
  );
}
