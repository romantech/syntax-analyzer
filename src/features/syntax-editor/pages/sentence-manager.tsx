import { Box, HStack, ScaleFade, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { CenteredDivider, Notice, useIsMounted } from '@/base';
import {
  AddSentenceForm,
  DEFAULT_SENTENCE_LIST_TAB,
  SentenceList,
} from '@/features/syntax-editor';
import {
  FieldGroupHeader,
  RandomSentenceForm,
} from '@/features/syntax-analyzer';

export default function SentenceManager() {
  const isMounted = useIsMounted();
  const [tabIndex, setTabIndex] = useState(DEFAULT_SENTENCE_LIST_TAB);

  return (
    <HStack pt={8} gap={8} align="start" justify="center">
      <Stack w="full" maxW={650}>
        <Notice
          size="sm"
          borderRadius="md"
          p={1}
          text="문장을 직접 추가하거나 선택한 후 편집할 수 있어요"
        />
        <AddSentenceForm onConfirmEffect={() => setTabIndex(0)} />
        <CenteredDivider py={4} />
        <Box>
          <FieldGroupHeader>랜덤 문장 생성</FieldGroupHeader>
          <RandomSentenceForm />
        </Box>
      </Stack>
      <Box borderRadius="lg" borderWidth={1} w="full" maxW="container.md" p={4}>
        <ScaleFade in={isMounted}>
          <SentenceList
            tabIndex={tabIndex}
            onTabChange={(i) => setTabIndex(i)}
          />
        </ScaleFade>
      </Box>
    </HStack>
  );
}
