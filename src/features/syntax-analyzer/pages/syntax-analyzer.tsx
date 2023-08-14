import { Box, CenterProps, HStack, Stack, StackProps } from '@chakra-ui/react';
import {
  AnalysisCounter,
  AnalysisForm,
  AnalysisLoadingIndicator,
  CREATE_ANALYSIS_BASE_KEY,
  FieldGroupHeader,
  RandomSentenceForm,
} from '@/features/syntax-analyzer';
import { Suspense } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { CenteredDivider } from '@/base';

export default function SyntaxAnalyzer() {
  const isMutating = useIsMutating({ mutationKey: CREATE_ANALYSIS_BASE_KEY });

  return (
    <Stack position="relative" h="full" overflow="hidden" pt={8} spacing={10}>
      <Stack gap={10} {...getFormTransitionStyles(isMutating)}>
        <Suspense fallback={<AnalysisCounter.Skeleton />}>
          <AnalysisCounter />
        </Suspense>
        <HStack align="start" justify="space-between">
          <Suspense fallback={<AnalysisForm.Skeleton />}>
            <AnalysisForm />
          </Suspense>
          <CenteredDivider
            h="full"
            dividerH="98%"
            orientation="vertical"
            px={10}
          />
          <Box>
            <FieldGroupHeader>랜덤 문장 생성</FieldGroupHeader>
            <RandomSentenceForm />
          </Box>
        </HStack>
      </Stack>
      <AnalysisLoadingIndicator {...getLoadingTransitionStyles(isMutating)} />
    </Stack>
  );
}

const getFormTransitionStyles = (isMutating: number): StackProps => {
  return {
    transition: 'transform 0.7s, opacity 0.4s, width 0.7s',
    w: isMutating ? '0' : 'full',
    h: isMutating ? '0' : 'fit-content',
    opacity: isMutating ? 0 : 1,
    transform: isMutating ? 'translateX(-100%)' : 'translateX(0)',
  };
};

const getLoadingTransitionStyles = (isMutating: number): CenterProps => {
  return {
    position: 'absolute',
    top: '45%',
    left: '45%',
    opacity: isMutating ? 1 : 0,
    transition: 'transform 0.7s, opacity 0.4s',
    transform: `translate(-50%, -50%) ${
      isMutating ? 'translateX(0)' : 'translateX(100%)'
    }`,
  };
};
