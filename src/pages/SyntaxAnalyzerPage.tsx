import { Stack } from '@chakra-ui/react';
import { AnalysisCounter, AnalysisForm } from '@/components/analysis-form';

export default function SyntaxAnalyzerPage() {
  return (
    <Stack maxW="container.md" mt={5} gap={10}>
      <AnalysisCounter />
      <AnalysisForm />
    </Stack>
  );
}
