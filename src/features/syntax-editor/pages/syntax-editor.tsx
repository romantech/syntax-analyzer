import { Box, Flex, Stack, useMediaQuery } from '@chakra-ui/react';
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
    <Stack
      h={{ lg: 'calc(100dvh - 72px)' }}
      minH={{ base: 'calc(100dvh - 60px)', lg: 0 }}
      gap={8}
      pt={8}
      pb={{ base: 8, lg: 0 }}
    >
      <Stack>
        <Notice
          text={
            isTapMode
              ? '태그를 고르고 시작·끝 단어를 탭한 뒤 적용하세요. 삭제할 태그는 약어를 누르세요.'
              : '문법 요소를 선택한 후 단어를 클릭하거나 드래그하면 태깅할 수 있어요'
          }
        />
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          <TagListAccordion flexGrow={1} minW={0} />
          <ControlPanel />
        </Flex>
        {isTapMode && <TapSelectionControls />}
      </Stack>
      <Box
        maxW="full"
        minW={0}
        overflowX="auto"
        flexGrow={1}
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
    </Stack>
  );
}
