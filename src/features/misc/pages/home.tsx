import { Stack, usePrefersReducedMotion } from '@chakra-ui/react';

import { Layout, LinkParticles } from '@/base';
import {
  AnalyzerShowcase,
  EditorShowcase,
  GeneratorShowcase,
  HeroShowcase,
} from '@/features/misc/components';

enum ShowCaseID {
  HERO = 'hero-showcase',
  ANALYZER = 'analyzer-showcase',
  EDITOR = 'editor-showcase',
  GENERATOR = 'generator-showcase',
}

const showCases = [
  { id: ShowCaseID.HERO, Component: HeroShowcase },
  { id: ShowCaseID.ANALYZER, Component: AnalyzerShowcase },
  { id: ShowCaseID.EDITOR, Component: EditorShowcase },
  { id: ShowCaseID.GENERATOR, Component: GeneratorShowcase },
];

export default function Home() {
  const prefersReducedMotion = usePrefersReducedMotion({ ssr: false });

  return (
    <Layout
      position="relative"
      maxW="full"
      h={{ lg: '100vh' }}
      overflowY={{ lg: 'auto' }}
      scrollSnapType={{ lg: 'y mandatory' }}
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <LinkParticles />
      <Stack maxW="8xl" mx="auto">
        {showCases.map(({ id, Component }, i) => {
          const nextId = showCases[i + 1]?.id;
          const onScrollDown = nextId
            ? () =>
                document
                  .getElementById(nextId)
                  ?.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth' })
            : undefined;
          return (
            <Component
              key={id}
              id={id}
              scrollMarginTop={{ base: 16, lg: 0 }}
              onScrollDown={onScrollDown}
            />
          );
        })}
      </Stack>
    </Layout>
  );
}
