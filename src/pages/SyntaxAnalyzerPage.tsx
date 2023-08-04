import { Stack } from '@chakra-ui/react';
import { AnalysisCounter, AnalysisForm } from '@/components/analysis-form';
import { Suspense } from 'react';

export default function SyntaxAnalyzerPage() {
  return (
    <Stack maxW="container.md" mt={5} gap={10}>
      <Suspense fallback={<AnalysisCounter.Skeleton />}>
        <AnalysisCounter />
      </Suspense>
      <Suspense>
        <AnalysisForm />
      </Suspense>
    </Stack>
  );
}
