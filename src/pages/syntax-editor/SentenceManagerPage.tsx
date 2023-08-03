import { AddSentenceForm, Notice, SentenceList } from '@/components';
import { Box, HStack, ScaleFade, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { DEFAULT_SENTENCE_LIST_TAB } from '@/constants/config';
import { useIsMounted } from '@/hooks';

export default function SentenceManagerPage() {
  const isMounted = useIsMounted();
  const [tabIndex, setTabIndex] = useState(DEFAULT_SENTENCE_LIST_TAB);

  return (
    <HStack mt={5} gap={8} align="start" justify="center">
      <Stack flexGrow={1} maxW={650}>
        <Notice
          size="sm"
          borderRadius="md"
          p={1}
          text="문장을 직접 추가하거나 선택한 후 편집할 수 있어요"
        />
        <AddSentenceForm onConfirmEffect={() => setTabIndex(0)} />
      </Stack>
      <Box
        borderRadius="lg"
        borderWidth={1}
        flexGrow={1}
        maxW="container.md"
        p={4}
      >
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
