import { Box, CenterProps, Stack, StackProps } from '@chakra-ui/react';
import {
  AnalysisCounter,
  CREATE_ANALYSIS_BASE_KEY,
  CreateAnalysisForm,
  RequestPlaceholder,
} from '@/features/syntax-analyzer';
import { Suspense } from 'react';
import { useIsMutating } from '@tanstack/react-query';

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
        <Suspense fallback={<CreateAnalysisForm.Skeleton />}>
          <CreateAnalysisForm />
        </Suspense>
      </Stack>
      <RequestPlaceholder {...getLoadingTransitionStyles(isMutating)} />
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
