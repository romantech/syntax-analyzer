import { Box } from '@chakra-ui/react';
import { useHideBodyScroll } from '@/base';
import { AnalyzerOverView, HeroSection } from '@/features/misc/components';

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
      <HeroSection nextSectionClass="analyzer-overview" />
      <AnalyzerOverView className="analyzer-overview" />
      <AnalyzerOverView className="analyzer-overview" />
      <AnalyzerOverView className="analyzer-overview" />
    </Box>
  );
}
