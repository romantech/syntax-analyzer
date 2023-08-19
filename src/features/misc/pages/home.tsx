import { Box } from '@chakra-ui/react';
import { LinkParticles, useHideBodyScroll } from '@/base';
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
  useHideBodyScroll();

  return (
    <Box
      position="relative"
      h="100vh"
      overflowY="auto"
      scrollSnapType="y mandatory"
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <LinkParticles />
      <HeroShowcase onScrollDown={getScrollHandler('analyzer-showcase')} />
      <AnalyzerShowcase
        id="analyzer-showcase"
        onScrollDown={getScrollHandler('editor-showcase')}
      />
      <EditorShowcase id="editor-showcase" />
    </Box>
  );
}
