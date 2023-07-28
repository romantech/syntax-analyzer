import { SyntaxParser, TagList, TagNotice } from '@/components';
import { Box, Flex, Stack } from '@chakra-ui/react';
import ControlPanel from '@/components/controlPanel/ControlPanel.tsx';
import { Provider } from 'jotai';
import { DevTools } from 'jotai-devtools';

const SyntaxEditor = () => {
  return (
    <Flex direction="column" minH="full" overflowX="auto" py={2} gap={8}>
      <Stack>
        <TagNotice />
        <Flex minW="full" gap={6}>
          <TagList flexGrow={1} />
          <ControlPanel />
        </Flex>
      </Stack>
      <Box>
        <SyntaxParser />
      </Box>
    </Flex>
  );
};

export default function SyntaxEditorPage() {
  return (
    <Provider>
      <DevTools theme="dark" />
      <SyntaxEditor />
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
