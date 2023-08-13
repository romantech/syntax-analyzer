import {
  Center,
  CenterProps,
  Divider,
  HStack,
  Stack,
  StackProps,
} from '@chakra-ui/react';
import {
  AnalysisCounter,
  CREATE_ANALYSIS_BASE_KEY,
  CreateAnalysisForm,
  RandomSentenceForm,
  RequestPlaceholder,
} from '@/features/syntax-analyzer';
import { Suspense } from 'react';
import { useIsMutating } from '@tanstack/react-query';

export default function SyntaxAnalyzer() {
  const isMutating = useIsMutating({ mutationKey: CREATE_ANALYSIS_BASE_KEY });

  return (
    <Stack position="relative" h="full" overflow="hidden" pt={8} spacing={10}>
      <Stack gap={10} {...getFormTransitionStyles(isMutating)}>
        <Suspense fallback={<AnalysisCounter.Skeleton />}>
          <AnalysisCounter />
        </Suspense>
        <HStack align="start" justify="space-between">
          <Suspense fallback={<CreateAnalysisForm.Skeleton />}>
            <CreateAnalysisForm />
          </Suspense>
          <Center h="full" px={10}>
            <Divider h="98%" orientation="vertical" />
          </Center>
          <RandomSentenceForm />
        </HStack>
      </Stack>
      <RequestPlaceholder {...getLoadingTransitionStyles(isMutating)} />
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
