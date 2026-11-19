import { Box, Heading, Stack, type StackProps, Text } from '@chakra-ui/react';
import { type DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useRef } from 'react';

import { loadingAnimation } from '@/assets/lottie';
import { LoadingTransition } from '@/features/syntax-analyzer/components/';

interface AnalysisLoadingIndicatorProps extends StackProps {
  play: boolean;
}

const syncPlayback = (dotLottie: DotLottie | null, play: boolean) => {
  if (!dotLottie) return;

  if (play) dotLottie.play();
  else dotLottie.stop();
};

export default function AnalysisLoadIndicator({
  play,
  ...stackProps
}: AnalysisLoadingIndicatorProps) {
  const dotLottieRef = useRef<DotLottie | null>(null);
  const handleDotLottieRef = (dotLottie: DotLottie | null) => {
    dotLottieRef.current = dotLottie;
    syncPlayback(dotLottie, play);
  };

  useEffect(() => {
    syncPlayback(dotLottieRef.current, play);
  }, [play]);

  return (
    <LoadingTransition
      type="indicator"
      role="status"
      direction={{ base: 'column', lg: 'row' }}
      align="center"
      isLoading={play}
      w="max-content"
      maxW="calc(100% - 32px)"
      textAlign={{ base: 'center', lg: 'start' }}
      pointerEvents="none"
      {...stackProps}
    >
      <Box w={{ base: 32, lg: 350 }} aspectRatio={1}>
        <DotLottieReact
          loop
          data={loadingAnimation}
          dotLottieRefCallback={handleDotLottieRef}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      <Stack gap={{ base: 2, lg: 5 }}>
        <Heading fontSize={{ base: '2xl', lg: '5xl' }} lineHeight={1.2} fontWeight="bold">
          문장 분석 중
        </Heading>
        <Text fontSize={{ base: 'md', lg: '2xl' }}>
          최대
          <Text as="span" borderRadius="md" bg="teal.200" color="gray.800" mx={1} px={1}>
            1분
          </Text>
          까지 소요될 수 있어요
        </Text>
      </Stack>
    </LoadingTransition>
  );
}
