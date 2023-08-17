import { Box, Flex, Stack } from '@chakra-ui/react';
import { Notice } from '@/base';
import {
  ControlPanel,
  SyntaxParser,
  TagListAccordion,
  useAnalysisDataLoader,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';

export default function SyntaxEditor() {
  useSyntaxEditorInitializer({ resetOnUnmount: true });
  useAnalysisDataLoader();

  return (
    <Stack minH="full" overflowX="auto" gap={8} pt={8}>
      <Stack>
        <Notice text="태그를 선택한 후 단어를 드래그 혹은 클릭 해주세요" />
        <Flex gap={6}>
          <TagListAccordion flexGrow={1} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box w="70%">
        <SyntaxParser />
      </Box>
    </Stack>
  );
}
