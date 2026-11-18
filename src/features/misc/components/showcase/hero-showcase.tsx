import { Heading, Stack, type StackProps, Text, useColorModeValue } from '@chakra-ui/react';
import ScrollDownButton from './scroll-down-button';

interface TitleSectionProps extends StackProps {
  onScrollDown?: () => void;
}

export default function HeroShowcase({ onScrollDown, ...stackProps }: TitleSectionProps) {
  const gradient = useColorModeValue(
    'linear(to-r, teal.700, yellow.800 60%)',
    'linear(to-r, teal.300, yellow.400 60%)',
  );

  return (
    <Stack justify="center" scrollSnapAlign="start" {...stackProps}>
      <Stack>
        <Heading as="p" size={{ base: 'md', lg: 'lg' }} bgGradient={gradient} bgClip="text">
          Interpreting English Structure with AI
        </Heading>
        <Heading
          as="h1"
          size={{ base: '2xl', sm: '3xl', lg: '4xl' }}
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
