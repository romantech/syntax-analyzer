import { Heading, Stack, type StackProps, Text } from '@chakra-ui/react';
import ScrollDownButton from './scroll-down-button';

interface TitleSectionProps extends StackProps {
  onScrollDown?: () => void;
}

export default function HeroShowcase({ onScrollDown, ...stackProps }: TitleSectionProps) {
  return (
    <Stack justify="center" scrollSnapAlign="start" {...stackProps}>
      <Stack>
        <Heading
          as="p"
          fontSize={{ base: 'xl', lg: '2xl' }}
          lineHeight={1.2}
          bgImage="linear-gradient(to right, var(--chakra-colors-teal-700), var(--chakra-colors-yellow-800) 60%)"
          bgClip="text"
          color="transparent"
          _dark={{
            bgImage:
              'linear-gradient(to right, var(--chakra-colors-teal-300), var(--chakra-colors-yellow-400) 60%)',
          }}
        >
          Interpreting English Structure with AI
        </Heading>
        <Heading
          as="h1"
          fontSize={{ base: '4xl', sm: '5xl', lg: '6xl' }}
          lineHeight={1.2}
          textTransform="uppercase"
          whiteSpace="pre-line"
          fontWeight="extrabold"
        >
          {`english syntax\nanalyzer`}
        </Heading>
      </Stack>
      <Text
        maxW="3xl"
        fontWeight={500}
        fontSize={{ base: '1.0625rem', lg: 'xl' }}
        lineHeight={{ base: '1.6875rem', lg: 'base' }}
      >
        Dive into the elegance of language as AI-analyzed English sentences unfold in a clear
        hierarchical visualization. Grasp the intricacies at a glance, and harness the freedom to
        directly edit and adapt as you see fit.
      </Text>
      <ScrollDownButton onClick={onScrollDown} hidden={!onScrollDown} />
    </Stack>
  );
}
