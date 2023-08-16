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
      <AnalysisLoadingIndicator
        play={Boolean(isMutating)}
        {...getLoadingTransitionStyles(isMutating)}
      />
    </Stack>
  );
}

const TRANSFORM_DURATION = '0.7s';
const OPACITY_DURATION = '0.4s';

const getFormTransitionStyles = (isMutating: number): StackProps => {
  return {
    transition: `transform ${TRANSFORM_DURATION}, opacity ${OPACITY_DURATION}`,
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
    transition: `transform ${TRANSFORM_DURATION}, opacity ${OPACITY_DURATION}`,
    transform: `translate(-50%, -50%) ${
      isMutating ? 'translateX(0)' : 'translateX(100%)'
    }`,
  };
};
