import { AddSentence, Notice, SentenceList } from '@/components';
import { useIsMounted } from '@/hooks';
import { HStack, SlideFade, VStack } from '@chakra-ui/react';

export default function SentenceManagerPage() {
  const isMounted = useIsMounted();

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
          <AddSentence />
        </VStack>
        <SentenceList />
      </HStack>
    </SlideFade>
  );
}
