import {
  Button,
  CloseButton,
  Drawer,
  HStack,
  Portal,
  Stack,
  Text,
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
  const { open, setOpen, onClose } = useDisclosure();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnToSentence = useRef(false);

  const begin = range ? Math.min(...range) : 0;
  const end = range ? Math.max(...range) + 1 : 0;
  const tagName = selectedTag && CONSTITUENT_TRANSLATIONS[selectedTag.label].ko;
  const focusSentence = () => sentenceRegionRef.current?.focus({ preventScroll: true });
  const cancelRange = () => {
    setRange(null);
    focusSentence();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={({ open }) => {
        if (open) returnToSentence.current = false;
        setOpen(open);
      }}
      placement="bottom"
      restoreFocus
      finalFocusEl={() =>
        returnToSentence.current ? sentenceRegionRef.current : triggerRef.current
      }
    >
      <Stack
        as="section"
        aria-label="태깅 도구막대"
        position="sticky"
        bottom={0}
        zIndex="sticky"
        mx={-4}
        px={4}
        pt={2}
        pb="calc(var(--chakra-spacing-4) + env(safe-area-inset-bottom, 0px))"
        gap={2}
        bg="bg"
        borderTopWidth="1px"
        borderColor="border"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && range && !open) cancelRange();
        }}
      >
        <Text role="status" fontSize="sm" color="fg.muted" lineClamp={2} overflowWrap="anywhere">
          {isDeleteMode && '지울 태그의 약어를 탭하세요.'}
          {selectedTag &&
            (range
              ? `${begin + 1 === end ? end : `${begin + 1}~${end}`}번째 단어 · ${sentence?.slice(begin, end).join(' ')}`
              : '시작 단어를 탭하세요. 범위를 선택하려면 끝 단어도 탭하세요.')}
        </Text>
        <HStack>
          <Drawer.Trigger asChild>
            <Button
              flex={1}
              minW={0}
              minH="44px"
              px={3}
              justifyContent="space-between"
              aria-label={tagName ? `태그 선택 (현재 ${tagName})` : '태그 선택'}
              disabled={!sentence}
              ref={triggerRef}
            >
              <Text as="span" truncate>
                {selectedTag ? `${tagName} · ${selectedTag.abbreviation}` : '태그 선택'}
              </Text>
              <FiChevronUp />
            </Button>
          </Drawer.Trigger>
          <Button
            minH="44px"
            px={3}
            disabled={!range}
            onClick={() => {
              applyTag(begin, end);
              focusSentence();
            }}
          >
            적용
          </Button>
          <Button minH="44px" px={3} variant="subtle" disabled={!range} onClick={cancelRange}>
            선택 취소
          </Button>
        </HStack>
        {range && invalidIndex === end - 1 && (
          <Text role="alert" color="fg.muted" fontSize="sm">
            구/절은 서로 교차할 수 없어요
          </Text>
        )}
        <EditorActions isTapMode />
      </Stack>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            borderTopRadius="xl"
            maxH="85dvh"
            _dark={{ bg: 'gray.700' }}
            pl="env(safe-area-inset-left, 0px)"
            pr="env(safe-area-inset-right, 0px)"
            pb="env(safe-area-inset-bottom, 0px)"
          >
            <Drawer.Header pr={16}>
              <Drawer.Title>태그 선택</Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger asChild>
              <CloseButton
                aria-label="태그 선택 닫기"
                boxSize="44px"
                right="calc(var(--chakra-spacing-2) + env(safe-area-inset-right, 0px))"
              />
            </Drawer.CloseTrigger>
            <Drawer.Body px={{ base: 3, sm: 6 }} overscrollBehavior="contain">
              <TagListAccordion
                onTagSelect={(tag) => {
                  if (selectedTag?.elementId !== tag.elementId) setSelectedTag(tag);
                  returnToSentence.current = true;
                  onClose();
                }}
              />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
