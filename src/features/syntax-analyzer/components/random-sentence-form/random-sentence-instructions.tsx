import { ListItem, ListProps, UnorderedList } from '@chakra-ui/react';
import { MAX_TOPICS } from '@/features/syntax-analyzer';

export default function RandomSentenceInstructions(listProps: ListProps) {
  return (
    <UnorderedList {...listProps}>
      <ListItem>입력한 키워드와 관련된 랜덤 문장을 생성할 수 있어요</ListItem>
      <ListItem>{`키워드는 ${MAX_TOPICS}개까지 추가할 수 있어요 (선택)`}</ListItem>
      <ListItem>문장을 클릭하면 클립보드에 복사할 수 있어요</ListItem>
    </UnorderedList>
  );
}
