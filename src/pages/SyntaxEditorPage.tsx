import { SyntaxParser, TagList } from '@/components';
import { Box, Flex } from '@chakra-ui/react';

export default function SyntaxEditorPage() {
  return (
    <Flex direction="column" minH="full" overflowX="auto" py={2} gap={8}>
      <TagList />
      <Box>
        <SyntaxParser />
      </Box>
    </Flex>
  );
}
