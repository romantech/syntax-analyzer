import { AddSentenceForm, Notice, SentenceList } from '@/components';
import { useIsMounted } from '@/hooks';
import { HStack, SlideFade, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { DEFAULT_SENTENCE_LIST_TAB } from '@/constants/config';

export default function SentenceManagerPage() {
  const isMounted = useIsMounted();
  const [tabIndex, setTabIndex] = useState(DEFAULT_SENTENCE_LIST_TAB);

  return (
    <SlideFade in={isMounted} offsetY={15}>
      <HStack mt="7vh" gap={8} align="start" justify="center">
        <VStack flexGrow={1} maxW={650}>
          <Notice
            size="sm"
            borderRadius="md"
            p={1}
            text="문장을 직접 추가하거나 선택한 후 편집할 수 있어요"
          />
          <AddSentenceForm onConfirmEffect={() => setTabIndex(0)} />
        </VStack>
        <SentenceList tabIndex={tabIndex} onTabChange={(i) => setTabIndex(i)} />
      </HStack>
    </SlideFade>
  );
}
