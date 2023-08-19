import { Heading, Stack, StackProps, Text } from '@chakra-ui/react';
import { LinkParticles } from '@/base';
import { ScrollDownButton } from '@/features/misc/components';

interface TitleSectionProps extends StackProps {
  nextSectionClass: string;
}

export default function HeroSection({
  nextSectionClass,
  ...stackProps
}: TitleSectionProps) {
  const onClick = () => {
    const nextSection = document.querySelector(`.${nextSectionClass}`);
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Stack justify="center" h="100vh" scrollSnapAlign="start" {...stackProps}>
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
      <ScrollDownButton onClick={onClick} />
    </Stack>
  );
}
