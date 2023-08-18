import { Box, Center, Heading, Stack, Text } from '@chakra-ui/react';
import { LinkParticles, useHideBodyScroll } from '@/base';

const TitleSection = () => {
  return (
    <Stack justify="center" h="100vh" scrollSnapAlign="start">
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
    </Stack>
  );
};

const AnalyzerDescSection = () => {
  return (
    <Center h="100vh" scrollSnapAlign="start">
      <Heading>Analyzer Description Section</Heading>
    </Center>
  );
};

export default function Home() {
  useHideBodyScroll();

  return (
    <Box
      position="relative"
      h="100vh"
      overflowY="auto"
      scrollSnapType="y mandatory"
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <TitleSection />
      <AnalyzerDescSection />
    </Box>
  );
}
