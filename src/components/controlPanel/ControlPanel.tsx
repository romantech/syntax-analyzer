import {
  Card,
  Divider,
  HStack,
  IconButton,
  Skeleton,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { IoSaveSharp } from 'react-icons/io5';
import {
  AbbrInfoSwitch,
  DeleteButton,
  RedoButton,
  TagInfoSwitch,
  UndoButton,
} from './components';

export default function ControlPanel() {
  const [mounted, setIsMounted] = useBoolean();

  useEffect(() => {
    /**
     * atomWithStorage를 사용했을 때. Jotai는 초기값을 로컬 스토리지 값을 기준으로함
     * 예를들어 atomWithStorage('user', false) 상태의 초기값을 false로 명시했지만,
     * 로컬 스토리지에 'user' 키 값이 있다면, user 상태를 로컬 스토리지 값으로 변경시킴.
     * user 상태가 true로 변하는 과정에서 토글이 자동으로 스위치 되는 현상 발생함
     * 이처럼 토클이 자동으로 스위치되는 현상을 방지하기 위해 마운트 후에 컴포넌트 표시
     * */
    setIsMounted.on();
  }, [setIsMounted]);

  return (
    <Skeleton maxH={175} w="20%" fitContent isLoaded={mounted} borderRadius={6}>
      <Card h="full" p={4} variant="outline">
        <VStack align="stretch" h="full" justify="space-between">
          <VStack>
            <TagInfoSwitch />
            <AbbrInfoSwitch />
          </VStack>
          <Divider />
          <HStack
            overflowY="hidden"
            overflowX="scroll"
            sx={{
              '::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <DeleteButton />
            <UndoButton />
            <RedoButton />
            <IconButton
              variant="solid"
              aria-label="Save your tagging result"
              icon={<IoSaveSharp />}
              isDisabled
              // TODO 구현
            />
          </HStack>
        </VStack>
      </Card>
    </Skeleton>
  );
}
