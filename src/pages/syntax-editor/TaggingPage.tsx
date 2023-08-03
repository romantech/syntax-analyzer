import { ControlPanel, Notice, SyntaxParser, TagList } from '@/components';
import { Box, Flex, Stack } from '@chakra-ui/react';
import {
  useInitializeSyntaxEditor,
  useSetCurrentAnalysisFromUrl,
} from '@/hooks';

export default function TaggingPage() {
  useInitializeSyntaxEditor({ autoReset: true });
  useSetCurrentAnalysisFromUrl();

  return (
    <Stack minH="full" overflowX="auto" gap={8}>
      <Stack mt={5}>
        <Notice text="태그를 선택한 후 단어를 드래그 혹은 클릭 해주세요" />
        <Flex gap={6}>
          <TagList flexGrow={1} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box w="70%">
        <SyntaxParser />
      </Box>
    </Stack>
  );
}
