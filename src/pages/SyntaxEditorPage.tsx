import { SyntaxParser, TagList, TagNotice } from '@/components';
import { Box, Flex, Stack } from '@chakra-ui/react';
import ControlPanel from '@/components/ControlPanel.tsx';

export default function SyntaxEditorPage() {
  return (
    <Flex direction="column" minH="full" overflowX="auto" py={2} gap={8}>
      <Stack>
        <TagNotice />
        <Flex minW="full" gap={6}>
          <TagList flexGrow={1} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box>
        <SyntaxParser />
      </Box>
    </Flex>
  );
}
