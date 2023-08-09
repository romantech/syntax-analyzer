import { Box, Flex, Stack } from '@chakra-ui/react';
import {
  ControlPanel,
  SyntaxParser,
  TagListAccordion,
  useAnalysisLoader,
  useInitializeSyntaxEditor,
} from '@/features/syntax-editor';
import { Notice } from '@/base';

export default function SyntaxEditor() {
  useInitializeSyntaxEditor({ autoReset: true });
  useAnalysisLoader();

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
