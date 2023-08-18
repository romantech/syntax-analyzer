import { Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { LinkParticles } from '@/base';

export default function Home() {
  return (
    <VStack
      position="relative"
      gap={8}
      align="start"
      minH="90%"
      justify="center"
    >
      <LinkParticles />
      <Stack>
        <Heading
          size="lg"
          bgGradient="linear(to-r, teal.300, yellow.400 60%)"
          bgClip="text"
        >
          Interpreting English Structure with AI
        </Heading>
        <Heading
          size="4xl"
          textTransform="uppercase"
          whiteSpace="pre-line"
          fontWeight="extrabold"
        >
          {`english syntax\nanalyzer`}
        </Heading>
      </Stack>
      <Text maxW="3xl" fontWeight={500} fontSize="xl">
        Dive into the elegance of language as AI-analyzed English sentences
        unfold in a clear hierarchical visualization. Grasp the intricacies at a
        glance, and harness the freedom to directly edit and adapt as you see
        fit.
      </Text>
    </VStack>
  );
}
