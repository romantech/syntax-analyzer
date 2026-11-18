import { Card, Divider, HStack, Skeleton, VStack } from '@chakra-ui/react';

import { useIsMounted } from '@/base';
import {
  AbbrInfoSwitch,
  DeleteButton,
  RedoButton,
  ResetButton,
  SaveButton,
  TagInfoSwitch,
  UndoButton,
} from '@/features/syntax-editor';

/**
 * atomWithStorage를 사용했을 때. Jotai는 초기값을 로컬 스토리지 값을 기준으로함
 * 예를들어 atomWithStorage('user', false) 상태의 초기값을 false로 명시했지만,
 * 로컬 스토리지에 'user' 키 값이 있다면, user 상태를 로컬 스토리지 값으로 변경시킴.
 * user 상태가 true로 변하는 과정에서 토글이 자동으로 스위치 되는 현상 발생함
 * 이처럼 토클이 자동으로 스위치되는 현상을 방지하기 위해 마운트 후에 컴포넌트 표시
 * */
export default function ControlPanel() {
  const isMounted = useIsMounted();

  return (
    <Skeleton
      h={129}
      w={{ base: 'full', lg: 288 }}
      maxW="full"
      flexShrink={0}
      fitContent
      isLoaded={isMounted}
      borderRadius={6}
    >
      <Card p={3} variant="outline">
        <VStack align="stretch" gap={2}>
          <HStack gap={4} flexWrap="wrap">
            <TagInfoSwitch w="auto" justify="start" gap={2} />
            <AbbrInfoSwitch w="auto" justify="start" gap={2} />
          </HStack>
          <Divider />
          <HStack
            overflowY="hidden"
            overflowX="auto"
            sx={{
              button: {
                minW: { base: '44px', lg: 10 },
                minH: { base: '44px', lg: 10 },
              },
            }}
            justify="start"
            gap={2}
          >
            <DeleteButton />
            <ResetButton />
            <UndoButton />
            <RedoButton />
            <SaveButton />
          </HStack>
        </VStack>
      </Card>
    </Skeleton>
  );
}
