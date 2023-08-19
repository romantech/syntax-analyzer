import { Box, HStack, Stack } from '@chakra-ui/react';
import {
  AnalysisCounter,
  AnalysisForm,
  AnalysisLoadIndicator,
  CREATE_ANALYSIS_BASE_KEY,
  FieldGroupHeader,
  LoadingTransition,
  RandomSentenceForm,
} from '@/features/syntax-analyzer';
import { Suspense } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { CenteredDivider } from '@/base';

export default function SyntaxAnalyzer() {
  const isMutating = useIsMutating({ mutationKey: CREATE_ANALYSIS_BASE_KEY });

  return (
    <Stack position="relative" h="full" overflow="hidden" pt={8} spacing={10}>
      <LoadingTransition gap={10} isLoading={!!isMutating} type="content">
        <Suspense fallback={<AnalysisCounter.Skeleton />}>
          <AnalysisCounter />
        </Suspense>
        <HStack align="start" justify="space-between">
          <Suspense fallback={<AnalysisForm.Skeleton />}>
            <AnalysisForm />
          </Suspense>
          <CenteredDivider h={380} orientation="vertical" pt={2} px={10} />
          <Box>
            <FieldGroupHeader>랜덤 문장 생성</FieldGroupHeader>
            <RandomSentenceForm />
          </Box>
        </HStack>
      </LoadingTransition>
      <AnalysisLoadIndicator play={!!isMutating} />
    </Stack>
  );
}
