import { ListItem, ListProps, UnorderedList } from '@chakra-ui/react';

import { MAX_TOPIC_ADDITION } from '@/features/syntax-analyzer';

const INSTRUCTIONS = [
  '입력한 키워드와 관련된 랜덤 문장을 생성할 수 있어요',
  `키워드는 ${MAX_TOPIC_ADDITION}개까지 추가할 수 있어요 (선택)`,
  '문장을 클릭하면 클립보드에 복사할 수 있어요',
];

export default function RandomSentenceInstructions(listProps: ListProps) {
  return (
    <UnorderedList {...listProps}>
      {INSTRUCTIONS.map((instruction, i) => (
        <ListItem key={i}>{instruction}</ListItem>
      ))}
    </UnorderedList>
  );
}
