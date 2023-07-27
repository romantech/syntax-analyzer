import { SyntaxParser, TagList, TagNotice } from '@/components';
import { Box, Flex, Stack } from '@chakra-ui/react';
import ControlPanel from '@/components/ControlPanel.tsx';
import {
  currentSegmentAtom,
  currentSentenceAtom,
} from '@/store/analysisStore.ts';
import { useAtomValue } from 'jotai';

// 문장 리스트를 검사한다
// 문장 리스트가 없으면 문장 입력 모달을 표시한다
// 문장 리스트가 있으면 문장 리스트 목록을 표시한다
// 문장을 선택한다 -> 현재 문장 상태를 변경한다
// ...
export default function SyntaxEditorPage() {
  const currentSegment = useAtomValue(currentSegmentAtom);
  const currentSentence = useAtomValue(currentSentenceAtom);
  const hasAnalysisData = currentSegment && currentSentence;

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
        {hasAnalysisData && (
          <SyntaxParser
            rootSegment={currentSegment}
            sentence={currentSentence}
          />
        )}
      </Box>
    </Flex>
  );
}
