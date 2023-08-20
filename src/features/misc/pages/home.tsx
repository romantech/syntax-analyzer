import { Stack } from '@chakra-ui/react';
import { Layout, LinkParticles } from '@/base';
import {
  AnalyzerShowcase,
  EditorShowcase,
  HeroShowcase,
} from '@/features/misc/components';

const getScrollHandler = (nextSectionId: string) => () => {
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
        <HeroShowcase onScrollDown={getScrollHandler('analyzer-showcase')} />
        <AnalyzerShowcase
          id="analyzer-showcase"
          onScrollDown={getScrollHandler('editor-showcase')}
        />
        <EditorShowcase id="editor-showcase" />
      </Stack>
    </Layout>
  );
}
