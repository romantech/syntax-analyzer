import { Box, Grid, useMediaQuery } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

import { Notice, useBeforeUnload } from '@/base';
import {
  ControlPanel,
  isSegmentTouchedAtom,
  SyntaxParser,
  TagListAccordion,
  TapSelectionControls,
  useAnalysisDataLoader,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';

export default function SyntaxEditor() {
  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const [isTapMode] = useMediaQuery('(max-width: 61.99em), (pointer: coarse)');

  useSyntaxEditorInitializer({ resetOnUnmount: true });
  useAnalysisDataLoader();
  useBeforeUnload(isTouched);

  return (
    <Grid
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 288px' }}
      alignItems="start"
      gap={5}
      py={5}
    >
      <Notice
        gridColumn="1 / -1"
        order={1}
        text={
          isTapMode
            ? '태그 선택 → 단어 탭 → 적용. 여러 단어는 끝 단어도 탭하세요.'
            : '문법 요소를 선택한 후 단어를 클릭하거나 드래그하면 태깅할 수 있어요'
        }
      />
      <TagListAccordion minW={0} order={2} />
      {isTapMode && (
        <Box gridColumn="1 / -1" order={3}>
          <TapSelectionControls />
        </Box>
      )}

      <Box
        gridColumn="1 / -1"
        order={{ base: 4, lg: 5 }}
        maxW="full"
        minW={0}
        overflowX="auto"
        pb={4}
        px={4}
        pt={2}
        tabIndex={0}
        role="region"
        aria-label="구문 문장 (가로 스크롤)"
        _focusVisible={{ outline: '2px solid', outlineColor: 'teal.300', outlineOffset: '-2px' }}
      >
        <SyntaxParser isTapMode={isTapMode} />
      </Box>
      <Box order={{ base: 5, lg: 3 }}>
        <ControlPanel />
      </Box>
    </Grid>
  );
}
