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
      <Stack maxW="8xl" mx="auto" gap={0}>
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
              minH={{ base: 'calc(100dvh - 60px)', lg: '100vh' }}
              pt={{ base: 8, lg: 0 }}
              pb={{ base: 'calc(112px + env(safe-area-inset-bottom, 0px))', lg: 0 }}
              scrollMarginTop={{ base: '60px', lg: 0 }}
              onScrollDown={onScrollDown}
            />
          );
        })}
      </Stack>
    </Layout>
  );
}
