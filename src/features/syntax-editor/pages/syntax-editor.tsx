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
    <Stack
      h={{ lg: 'calc(100dvh - 72px)' }}
      minH={{ base: 'calc(100dvh - 60px)', lg: 0 }}
      gap={8}
      pt={8}
      pb={{ base: 8, lg: 0 }}
    >
      <Stack>
        <Notice text="문법 요소를 선택한 후 단어를 클릭하거나 드래그하면 태깅할 수 있어요" />
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          <TagListAccordion flexGrow={1} minW={0} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box maxW="full" overflowX="auto" flexGrow={1}>
        <SyntaxParser />
      </Box>
    </Stack>
  );
}
