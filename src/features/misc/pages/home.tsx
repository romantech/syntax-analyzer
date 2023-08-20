import { Stack } from '@chakra-ui/react';
import { Layout, LinkParticles } from '@/base';
import {
  AnalyzerShowcase,
  EditorShowcase,
  GeneratorShowcase,
  HeroShowcase,
} from '@/features/misc/components';

enum ShowCaseID {
  ANALYZER = 'analyzer-showcase',
  EDITOR = 'editor-showcase',
  GENERATOR = 'generator-showcase',
}

const getScrollHandler = (nextSectionId: ShowCaseID) => () => {
  const nextSection = document.querySelector(`#${nextSectionId}`);
  nextSection?.scrollIntoView({ behavior: 'smooth' });
};

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
        <HeroShowcase onScrollDown={getScrollHandler(ShowCaseID.ANALYZER)} />
        <AnalyzerShowcase
          id={ShowCaseID.ANALYZER}
          onScrollDown={getScrollHandler(ShowCaseID.EDITOR)}
        />
        <EditorShowcase
          id={ShowCaseID.EDITOR}
          onScrollDown={getScrollHandler(ShowCaseID.GENERATOR)}
        />
        <GeneratorShowcase id={ShowCaseID.GENERATOR} />
      </Stack>
    </Layout>
  );
}
