import { Box, HStack } from '@chakra-ui/react';
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
import { CenteredDivider, Layout } from '@/base';

export default function SyntaxAnalyzer() {
  const isMutating = useIsMutating({ mutationKey: CREATE_ANALYSIS_BASE_KEY });

  return (
    <Layout position="relative" overflow="hidden" pt={8}>
      <LoadingTransition gap={10} isLoading={!!isMutating} type="content">
        <Suspense fallback={<AnalysisCounter.Skeleton />}>
          <AnalysisCounter />
        </Suspense>
        <HStack align="start" justify="space-between">
          <Suspense fallback={<AnalysisForm.Skeleton />}>
            <AnalysisForm />
          </Suspense>
          <CenteredDivider h={395} orientation="vertical" pt={1.5} px={12} />
          <Box w="full" maxW={630}>
            <FieldGroupHeader>랜덤 문장 생성</FieldGroupHeader>
            <RandomSentenceForm />
          </Box>
        </HStack>
      </LoadingTransition>
      <AnalysisLoadIndicator play={!!isMutating} />
    </Layout>
  );
}
