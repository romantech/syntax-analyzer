import { Box, Flex, Stack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

import { Notice, useBeforeUnload } from '@/base';
import {
  ControlPanel,
  isSegmentTouchedAtom,
  SyntaxParser,
  TagListAccordion,
  useAnalysisDataLoader,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';

export default function SyntaxEditor() {
  const isTouched = useAtomValue(isSegmentTouchedAtom);

  useSyntaxEditorInitializer({ resetOnUnmount: true });
  useAnalysisDataLoader();
  useBeforeUnload(isTouched);

  return (
    <Stack h="calc(100vh - 72px)" gap={8} pt={8}>
      <Stack>
        <Notice text="태그를 선택한 후 단어를 드래그 혹은 클릭 해주세요" />
        <Flex gap={6}>
          <TagListAccordion flexGrow={1} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box maxW="full" overflowX="auto" flexGrow={1}>
        <SyntaxParser />
      </Box>
    </Stack>
  );
}
