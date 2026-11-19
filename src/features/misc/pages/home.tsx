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
      fitViewport
      position="relative"
      maxW="full"
      minH={0}
      overflowY="auto"
      scrollSnapType="y mandatory"
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <LinkParticles />
      <Stack h="full" maxW="8xl" mx="auto" gap={0}>
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
              position="relative"
              minH="full"
              flexShrink={0}
              pt={{ base: 4, lg: 0 }}
              pb={{ base: 'calc(100px + env(safe-area-inset-bottom, 0px))', lg: 0 }}
              onScrollDown={onScrollDown}
            />
          );
        })}
      </Stack>
    </Layout>
  );
}
