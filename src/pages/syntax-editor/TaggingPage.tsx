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
    <Flex direction="column" minH="full" overflowX="auto" py={2} gap={8}>
      <Stack>
        <Notice text="태그를 선택한 후 단어를 드래그 혹은 클릭 해주세요" />
        <Flex minW="full" gap={6}>
          <TagList flexGrow={1} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box w="70%">
        <SyntaxParser />
      </Box>
    </Flex>
  );
}
