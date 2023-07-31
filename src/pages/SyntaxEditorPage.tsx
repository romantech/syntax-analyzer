import {
  AddSentence,
  ControlPanel,
  SentenceList,
  SyntaxParser,
  TagList,
} from '@/components';
import { Box, Flex, HStack, SlideFade, Stack, VStack } from '@chakra-ui/react';
import { Provider, useAtomValue } from 'jotai';
import { DevTools } from 'jotai-devtools';
import { currentAnalysisIndexAtom } from '@/store/analysisStore';
import { Fragment } from 'react';
import { Notice } from '@/components/common';
import { useIsMounted } from '@/hooks';

const SyntaxEditor = () => {
  return (
    <Flex direction="column" minH="full" overflowX="auto" py={2} gap={8}>
      <Stack>
        <Notice text="태그를 선택한 후 단어를 드래그 혹은 클릭 해주세요" />
        <Flex minW="full" gap={6}>
          <TagList flexGrow={1} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box w="70%">
        <SyntaxParser />
      </Box>
    </Flex>
  );
};

const SelectSentence = () => {
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
};

const Switcher = () => {
  const currentAnalysisIndex = useAtomValue(currentAnalysisIndexAtom);
  return (
    <Fragment>
      {currentAnalysisIndex && <SyntaxEditor />}
      {!currentAnalysisIndex && <SelectSentence />}
    </Fragment>
  );
};

export default function SyntaxEditorPage() {
  return (
    <Provider>
      <DevTools theme="dark" />
      <Switcher />
    </Provider>
  );
}

/**
 * Provider를 지정하지 않으면 Jotai 기본 저장소를 사용해서 전역 상태처럼 작동.
 * 때문에 어떤 컴포넌트든지 atom을 참조하면 항상 동일한 값을 갖게됨.
 * 반면, Provider를 사용하면 Provider 범위 내에서만 상태를 공유함.
 * 즉, 동일한 atom 이라도 서로 다른 Provider 내에선 다른 값을 가질 수 있음
 * 또한 마운트시 초기값을 갖을 수 있고, 언마운트시 모든 atom 값이 삭제됨.
 * @see https://jotai.org/docs/core/provider
 * */
