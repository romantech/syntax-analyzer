import { Box, Flex, Grid, HStack } from '@chakra-ui/react';
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

export default function SyntaxEditor() {
  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const isTapMode = useOutletContext<boolean>();
  const sentenceRegionRef = useRef<HTMLDivElement>(null);

  useSyntaxEditorInitializer({ resetOnUnmount: true });
  useAnalysisDataLoader();
  useBeforeUnload(isTouched);

  return (
    <Flex direction="column" flex={1} minH={isTapMode ? 0 : undefined}>
      <Grid
        templateColumns={isTapMode ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 288px'}
        templateRows={isTapMode ? 'auto auto minmax(4rem, 1fr)' : undefined}
        flex={1}
        alignContent="start"
        alignItems="start"
        overflowY={isTapMode ? 'auto' : undefined}
        overscrollBehaviorY={isTapMode ? 'contain' : undefined}
        gap={isTapMode ? 2 : 5}
        pt={isTapMode ? 4 : 5}
        pb={isTapMode ? 2 : 5}
      >
        <Notice
          gridColumn="1 / -1"
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
        <Box
          ref={sentenceRegionRef}
          gridColumn="1 / -1"
          minW={0}
          maxH={isTapMode ? 'full' : undefined}
          overflow="auto"
          pb={4}
          px={4}
          pt={2}
          tabIndex={0}
          role="region"
          aria-label="구문 문장"
          _focusVisible={{ outline: '2px solid', outlineColor: 'teal.300', outlineOffset: '-2px' }}
        >
          <SyntaxParser isTapMode={isTapMode} />
        </Box>
      </Grid>
      {isTapMode && <TapSelectionControls sentenceRegionRef={sentenceRegionRef} />}
    </Flex>
  );
}
