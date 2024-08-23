import { ListItem, ListProps, UnorderedList } from '@chakra-ui/react';

import { MAX_TOPIC_ADDITION } from '@/features/syntax-analyzer';

const INSTRUCTIONS = [
  `최대 ${MAX_TOPIC_ADDITION}개의 토픽을 추가해서 랜덤 문장을 생성할 수 있어요`,
  '토픽을 등록하지 않으면 랜덤한 주제로 문장을 생성해요',
  '생성한 문장을 클릭하면 클립보드에 복사돼요',
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
