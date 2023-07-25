import { VStack } from '@chakra-ui/react';
import { SyntaxParser } from '@/components';

export default function SyntaxEditorPage() {
  return (
    <VStack justify="center" align="center" minH="90%">
      <SyntaxParser />
    </VStack>
  );
}
