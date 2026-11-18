import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import {
  applySelectedTagAtom,
  CONSTITUENT_TRANSLATIONS,
  invalidRangeIndexAtom,
  selectedAnalysisAtom,
  selectedTagAtom,
  selectedTokenRangeAtom,
} from '@/features/syntax-editor';

export default function TapSelectionControls() {
  const selectedTag = useAtomValue(selectedTagAtom);
  const sentence = useAtomValue(selectedAnalysisAtom)?.sentence;
  const [range, setRange] = useAtom(selectedTokenRangeAtom);
  const invalidIndex = useAtomValue(invalidRangeIndexAtom);
  const applyTag = useSetAtom(applySelectedTagAtom);
  if (!selectedTag) return null;

  const begin = range ? Math.min(...range) : 0;
  const end = range ? Math.max(...range) + 1 : 0;
  const tagName = CONSTITUENT_TRANSLATIONS[selectedTag.label]?.ko ?? selectedTag.label;

  return (
    <Stack
      gap={2}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setRange(null);
      }}
    >
      <Text role="status" fontSize="sm" overflowWrap="anywhere">
        {range
          ? `${tagName} · ${begin + 1}~${end}번째 단어: ${sentence?.slice(begin, end).join(' ')}`
          : `${tagName} · 시작 단어를 탭하세요. 여러 단어는 끝 단어도 탭하세요.`}
      </Text>
      <HStack>
        <Button
          h="44px"
          colorScheme="teal"
          isDisabled={!range}
          onClick={() => applyTag(begin, end)}
        >
          적용
        </Button>
        <Button h="44px" isDisabled={!range} onClick={() => setRange(null)}>
          선택 취소
        </Button>
      </HStack>
      {invalidIndex !== null && (
        <Text role="alert" color="description" fontSize="sm">
          구/절은 서로 교차할 수 없어요
        </Text>
      )}
    </Stack>
  );
}
