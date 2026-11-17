import { Box, Grid, ScaleFade, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import { Notice, useIsMounted } from '@/base';
import { FieldGroupHeader, RandomSentenceForm } from '@/features/syntax-analyzer';
import { AddSentenceForm, DEFAULT_SENTENCE_LIST_TAB, SentenceList } from '@/features/syntax-editor';

export default function SentenceManager() {
  const isMounted = useIsMounted();
  const [tabIndex, setTabIndex] = useState(DEFAULT_SENTENCE_LIST_TAB);

  return (
    <Grid
      py={8}
      gap={8}
      alignItems="start"
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 650px) minmax(0, 768px)' }}
      templateRows={{ lg: 'auto 1fr' }}
      templateAreas={{ base: '"input" "list" "generator"', lg: '"input list" "generator list"' }}
    >
      <Stack gridArea="input">
        <Notice
          size="sm"
          borderRadius="md"
          p={1}
          text="문장을 직접 추가하거나 선택한 후 편집할 수 있어요"
        />
        <AddSentenceForm onConfirmEffect={() => setTabIndex(0)} />
      </Stack>
      <Box gridArea="list" borderRadius="lg" borderWidth={1} p={{ base: 3, md: 4 }}>
        <ScaleFade in={isMounted}>
          <SentenceList tabIndex={tabIndex} onTabChange={(i) => setTabIndex(i)} />
        </ScaleFade>
      </Box>
      <Box gridArea="generator">
        <FieldGroupHeader>랜덤 문장 생성</FieldGroupHeader>
        <RandomSentenceForm />
      </Box>
    </Grid>
  );
}
