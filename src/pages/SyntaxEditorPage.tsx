import { sampleData } from '@/constants/dummy';
import { Segments, Token } from '@/components';
import { Text, VStack } from '@chakra-ui/react';

const Tokens = sampleData.sentence.map((token, i) => (
  <Token token={token} key={i} index={i} isFirst={i === 0} />
));

export default function SyntaxEditorPage() {
  return (
    <VStack justify="center" align="center" minH="90%">
      <Text fontSize="3xl">
        {[sampleData.rootSegment].map((segment) => (
          <Segments key={segment.id} segment={segment} tokenElements={Tokens} />
        ))}
      </Text>
    </VStack>
  );
}
