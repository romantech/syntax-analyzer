import { Box, Flex, Grid, HStack, ScrollArea } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { useOutletContext } from 'react-router';

import { Notice, useBeforeUnload } from '@/base';
import {
  AbbrInfoSwitch,
  ControlPanel,
  isSegmentTouchedAtom,
  SyntaxParser,
  TagInfoSwitch,
  TagListAccordion,
  TapSelectionControls,
  useAnalysisDataLoader,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';

const SHORT_VIEWPORT = '@media (max-height: 24rem)';
const SENTENCE_ROW = 'minmax(calc(4rem + var(--horizontal-scrollbar-overlap)), 1fr)';

export default function SyntaxEditor() {
  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const isTapMode = useOutletContext<boolean>();
  const sentenceRegionRef = useRef<HTMLDivElement>(null);

  useSyntaxEditorInitializer({ resetOnUnmount: true });
  useAnalysisDataLoader();
  useBeforeUnload(isTouched);

  const sentenceRegionProps = {
    ref: sentenceRegionRef,
    tabIndex: 0,
    role: 'region',
    'aria-label': '구문 문장',
    _focusVisible: { outlineOffset: '-2px' },
  };

  return (
    <Flex direction="column" flex={1} minH={isTapMode ? 0 : undefined}>
      <Grid
        templateColumns={isTapMode ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 288px'}
        templateRows={isTapMode ? `auto auto ${SENTENCE_ROW}` : undefined}
        flex={1}
        alignContent="start"
        alignItems="start"
        overflowY={isTapMode ? 'auto' : undefined}
        overscrollBehaviorY={isTapMode ? 'contain' : undefined}
        gap={isTapMode ? 2 : 5}
        pt={isTapMode ? 4 : 5}
        pb={isTapMode ? 0 : 5}
        css={
          isTapMode
            ? {
                '--vertical-scrollbar-offset': '8px',
                '--horizontal-scrollbar-overlap': '5.5px',
                marginInlineEnd: 'calc(-1 * var(--vertical-scrollbar-offset))',
                marginBlockEnd: 'calc(-1 * var(--horizontal-scrollbar-overlap))',
                paddingInlineEnd: 'var(--vertical-scrollbar-offset)',
                [SHORT_VIEWPORT]: { gridTemplateRows: `auto ${SENTENCE_ROW}`, pt: 2 },
              }
            : undefined
        }
      >
        <Notice
          gridColumn="1 / -1"
          css={isTapMode ? { [SHORT_VIEWPORT]: { display: 'none' } } : undefined}
          text={
            isTapMode
              ? '태그를 고르고 단어를 탭한 뒤 적용하세요.'
              : '문법 요소를 선택한 후 단어를 클릭하거나 드래그하면 태깅할 수 있어요'
          }
        />
        {isTapMode ? (
          <HStack gap={4} flexWrap="wrap">
            <TagInfoSwitch w="auto" justifyContent="start" />
            <AbbrInfoSwitch w="auto" justifyContent="start" />
          </HStack>
        ) : (
          <>
            <TagListAccordion minW={0} />
            <ControlPanel />
          </>
        )}
        {isTapMode ? (
          <ScrollArea.Root
            gridColumn="1 / -1"
            minW={0}
            alignSelf="stretch"
            size="sm"
            variant="always"
            w="calc(100% + var(--vertical-scrollbar-offset))"
            pe="calc(var(--scrollbar-click-area) + var(--vertical-scrollbar-offset))"
            pb="calc(var(--scrollbar-click-area) + var(--horizontal-scrollbar-overlap))"
          >
            <ScrollArea.Viewport {...sentenceRegionProps}>
              <ScrollArea.Content px={4} pt={2} pb={4}>
                <SyntaxParser isTapMode />
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              bg="transparent"
              style={{ bottom: 'calc(var(--corner-height) + var(--horizontal-scrollbar-overlap))' }}
            >
              <ScrollArea.Thumb bg="gray.500" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar
              orientation="horizontal"
              bg="transparent"
              zIndex="calc(var(--chakra-z-index-sticky) + 1)"
              style={{
                insetInlineEnd: 'calc(var(--corner-width) + var(--vertical-scrollbar-offset))',
              }}
            >
              <ScrollArea.Thumb bg="gray.500" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner bg="transparent" />
          </ScrollArea.Root>
        ) : (
          <Box
            gridColumn="1 / -1"
            minW={0}
            overflow="auto"
            pb={4}
            px={4}
            pt={2}
            {...sentenceRegionProps}
          >
            <SyntaxParser />
          </Box>
        )}
      </Grid>
      {isTapMode && <TapSelectionControls sentenceRegionRef={sentenceRegionRef} />}
    </Flex>
  );
}
