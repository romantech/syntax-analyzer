import { TagList, SyntaxParser } from '@/components';
import { Box, Flex } from '@chakra-ui/react';

export default function SyntaxEditorPage() {
  return (
    <Flex direction="column" minH="full" overflowX="auto">
      <TagList />
      <Box>
        <SyntaxParser />
      </Box>
    </Flex>
  );
}
