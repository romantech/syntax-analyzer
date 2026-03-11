import { Heading, Stack, type StackProps, Text } from '@chakra-ui/react';
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
      display="flex"
      direction="row"
      align="center"
      isLoading={play}
      zIndex={-1}
      {...stackProps}
    >
      <DotLottieReact
        loop
        data={loadingAnimation}
        dotLottieRefCallback={handleDotLottieRef}
        style={{ width: 350, height: 350 }}
      />
      <Stack spacing={5}>
        <Heading size="3xl" fontWeight="bold">
          문장 분석 중
        </Heading>
        <Text fontSize="2xl">
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
