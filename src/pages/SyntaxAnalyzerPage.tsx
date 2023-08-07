import {
  Box,
  Center,
  CenterProps,
  Heading,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { AnalysisCounter, AnalysisForm } from '@/components/analysis-form';
import { Suspense } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '@/assets/lottie/loading.json';
import { useIsMutating } from '@tanstack/react-query';
import { CREATE_ANALYSIS_BASE_KEY } from '@/queries';

export default function SyntaxAnalyzerPage() {
  const isMutating = useIsMutating({ mutationKey: CREATE_ANALYSIS_BASE_KEY });

  return (
    <Box position="relative" h="80%" overflow="hidden" pt={8}>
      <Stack
        maxW="container.md"
        gap={10}
        {...getFormTransitionStyles(isMutating)}
      >
        <Suspense fallback={<AnalysisCounter.Skeleton />}>
          <AnalysisCounter />
        </Suspense>
        <Suspense>
          <AnalysisForm />
        </Suspense>
      </Stack>
      <Center {...getLoadingTransitionStyles(isMutating)}>
        <Player
          src={loadingAnimation}
          loop
          autoplay
          style={{ width: 350, height: 350 }}
        />
        <Stack>
          <Heading>문장 분석중...</Heading>
          <Text fontSize="2xl">최대 1분까지 소요될 수 있어요</Text>
        </Stack>
      </Center>
    </Box>
  );
}

const getFormTransitionStyles = (isMutating: number): StackProps => {
  return {
    transition: 'transform 0.6s, opacity 0.6s, width 0.6s',
    w: isMutating ? '0' : 'full',
    h: isMutating ? '0' : 'fit-content',
    opacity: isMutating ? 0 : 1,
    transform: isMutating ? 'translateX(-100%)' : 'translateX(0)',
  };
};

const getLoadingTransitionStyles = (isMutating: number): CenterProps => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transition: 'transform 0.6s, opacity 0.6s',
    transform: `translate(-50%, -50%) ${isMutating ? '' : 'translateX(100%)'}`,
    opacity: isMutating ? 1 : 0,
  };
};
