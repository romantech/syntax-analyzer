import { Box } from '@chakra-ui/react';
import { useHideBodyScroll } from '@/base';
import { AnalyzerOverView, HeroSection } from '@/features/misc/components';

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
      <HeroSection onScrollDown={getScrollHandler('analyzer-overview')} />
      <AnalyzerOverView
        id="analyzer-overview"
        onScrollDown={getScrollHandler('analyzer-overview2')}
      />
      <AnalyzerOverView id="analyzer-overview2" />
    </Box>
  );
}
