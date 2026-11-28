import { Box, Heading, Stack, type StackProps, Text } from '@chakra-ui/react';
import { type DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      gap={{ base: 0, md: 2 }}
      isLoading={play}
      w="max-content"
      maxW="calc(100% - 32px)"
      textAlign={{ base: 'center', lg: 'start' }}
      textWrap={{ mdDown: 'balance' }}
      pointerEvents="none"
      css={{ mdDown: { '@media (orientation: portrait)': { mt: -6 } } }}
      {...stackProps}
    >
      {/* The animation has transparent padding below the artwork. */}
      <Box
        w={{ base: 60, md: 32, lg: 350 }}
        maxW={{ mdDown: 'min(100%, 45svh)' }}
        mb={{ mdDown: -8 }}
        aspectRatio={1}
      >
        <DotLottieReact
          loop
          data={loadingAnimation}
          dotLottieRefCallback={handleDotLottieRef}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      <Stack gap={{ base: 2, lg: 5 }}>
        <Heading
          fontSize={{ base: '4xl', md: '3xl', lg: '6xl' }}
          lineHeight={{ base: 1.2, lg: 1 }}
          fontWeight="bold"
        >
          {t('analyzer.loading')}
        </Heading>
        <Text fontSize={{ base: 'xl', md: 'md', lg: '2xl' }}>
          <Trans
            t={t}
            i18nKey="analyzer.loadingTime"
            components={{
              time: <Text as="span" borderRadius="md" bg="teal.subtle" color="teal.fg" px={1} />,
            }}
          />
        </Text>
      </Stack>
    </LoadingTransition>
  );
}
