import { Stack } from '@chakra-ui/react';
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

const getScrollHandler = (nextSectionId: ShowCaseID) => () => {
  const nextSection = document.querySelector(`#${nextSectionId}`);
  nextSection?.scrollIntoView({ behavior: 'smooth' });
};

const showCases = [
  { id: ShowCaseID.HERO, Component: HeroShowcase },
  { id: ShowCaseID.ANALYZER, Component: AnalyzerShowcase },
  { id: ShowCaseID.EDITOR, Component: EditorShowcase },
  { id: ShowCaseID.GENERATOR, Component: GeneratorShowcase },
];

export default function Home() {
  return (
    <Layout
      position="relative"
      maxW="full"
      h="100vh"
      overflowY="auto"
      scrollSnapType="y mandatory"
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <LinkParticles />
      <Stack maxW="8xl" mx="auto">
        {showCases.map(({ id, Component }, i) => {
          const nextId = showCases[i + 1]?.id;
          const scrollHandler = nextId ? getScrollHandler(nextId) : undefined;
          return <Component key={id} id={id} onScrollDown={scrollHandler} />;
        })}
      </Stack>
    </Layout>
  );
}
