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
import { useTranslation } from 'react-i18next';
import { FiChevronUp } from 'react-icons/fi';
import {
  applySelectedTagAtom,
  deleteModeAtom,
  invalidRangeIndexAtom,
  selectedAnalysisAtom,
  selectedTagActionAtom,
  selectedTokenRangeAtom,
  TagListAccordion,
} from '@/features/syntax-editor';
import { getConstituentTranslation } from '../../helpers/constituent-translation';

import { EditorActions } from './control-panel';

export default function TapSelectionControls({
  sentenceRegionRef,
}: {
  sentenceRegionRef: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();
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
  const tagName = selectedTag && getConstituentTranslation(t, selectedTag).name;
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
        aria-label={t('editor.toolbar')}
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
          {isDeleteMode && t('editor.tapToDelete')}
          {selectedTag &&
            (range ? (
              <>
                {t('editor.selectedRange', {
                  range: begin + 1 === end ? String(end) : `${begin + 1}–${end}`,
                })}{' '}
                · <span lang="en">{sentence?.slice(begin, end).join(' ')}</span>
              </>
            ) : (
              t('editor.pickRange')
            ))}
        </Text>
        <HStack>
          <Drawer.Trigger asChild>
            <Button
              flex={1}
              minW={0}
              minH="44px"
              px={3}
              justifyContent="space-between"
              aria-label={
                tagName ? t('editor.currentTag', { tag: tagName }) : t('editor.chooseTag')
              }
              disabled={!sentence}
              ref={triggerRef}
            >
              <Text as="span" truncate>
                {selectedTag ? `${tagName} · ${selectedTag.abbreviation}` : t('editor.chooseTag')}
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
            {t('editor.apply')}
          </Button>
          <Button minH="44px" px={3} variant="subtle" disabled={!range} onClick={cancelRange}>
            {t('editor.clearSelection')}
          </Button>
        </HStack>
        {range && invalidIndex === end - 1 && (
          <Text role="alert" color="fg.muted" fontSize="sm">
            {t('editor.crossingRange')}
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
            pl="env(safe-area-inset-left, 0px)"
            pr="env(safe-area-inset-right, 0px)"
            pb="env(safe-area-inset-bottom, 0px)"
          >
            <Drawer.Header pr={16}>
              <Drawer.Title>{t('editor.chooseTag')}</Drawer.Title>
            </Drawer.Header>
            <Drawer.CloseTrigger asChild>
              <CloseButton
                aria-label={t('editor.closeTagPicker')}
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
