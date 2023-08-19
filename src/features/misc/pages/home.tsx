import { Box } from '@chakra-ui/react';
import { useHideBodyScroll } from '@/base';
import { AnalyzerShowcase, HeroShocase } from '@/features/misc/components';

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
      <HeroShocase onScrollDown={getScrollHandler('analyzer-overview')} />
      <AnalyzerShowcase id="analyzer-overview" />
    </Box>
  );
}
