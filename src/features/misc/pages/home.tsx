import { Heading, Stack, Text, VStack } from '@chakra-ui/react';
import Particles from 'react-tsparticles';
import { loadLinksPreset } from 'tsparticles-preset-links';
import { Engine, ISourceOptions } from 'tsparticles-engine';

export default function Home() {
  const options: ISourceOptions = {
    preset: 'links',
    fullScreen: { enable: false, zIndex: -1 },
    background: { color: 'transparent' },
    particles: {
      opacity: { value: 0.3 },
      line_linked: { opacity: 0.3 },
    },
  };

  const customInit = async (engine: Engine) => {
    await loadLinksPreset(engine);
  };

  return (
    <VStack
      position="relative"
      gap={8}
      align="start"
      minH="90%"
      justify="center"
    >
      <Particles
        style={{ position: 'absolute', top: 0, left: 0 }}
        options={options}
        init={customInit}
      />
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
