import { Box, Stack } from '@chakra-ui/react';
import { useIsMutating } from '@tanstack/react-query';
import { Suspense } from 'react';

import { Layout } from '@/base';
import {
  AnalysisCounter,
  AnalysisForm,
  AnalysisLoadIndicator,
  CREATE_ANALYSIS_BASE_KEY,
  FieldGroupHeader,
  LoadingTransition,
  RandomSentenceForm,
} from '@/features/syntax-analyzer';

export default function SyntaxAnalyzer() {
  const isMutating = useIsMutating({ mutationKey: CREATE_ANALYSIS_BASE_KEY });

  return (
    <Layout position="relative" overflow="hidden" py={8}>
      <LoadingTransition
        gap={{ base: 8, lg: 10 }}
        isLoading={!!isMutating}
        inert={!!isMutating}
        type="content"
      >
        <Suspense fallback={<AnalysisCounter.Skeleton />}>
          <AnalysisCounter />
        </Suspense>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 12, lg: 10 }}
          align="start"
          justify="space-between"
        >
          <Suspense fallback={<AnalysisForm.Skeleton />}>
            <AnalysisForm />
          </Suspense>
          <Box w="full" maxW={630}>
            <FieldGroupHeader>랜덤 문장 생성</FieldGroupHeader>
            <RandomSentenceForm />
          </Box>
        </Stack>
      </LoadingTransition>
      <AnalysisLoadIndicator play={!!isMutating} />
    </Layout>
  );
}
