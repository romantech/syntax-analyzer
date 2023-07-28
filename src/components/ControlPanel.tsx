import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  Card,
  Divider,
  FormLabel,
  HStack,
  IconButton,
  Skeleton,
  StackProps,
  Switch,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import {
  abbrInfoModeAtom,
  tagInfoModeAtom,
  toggleDeleteModeActionAtom,
} from '@/store/controlPanelStore.ts';
import { BsFillEraserFill } from 'react-icons/bs';
import { useEffect } from 'react';
import { ImRedo, ImUndo } from 'react-icons/im';
import {
  segmentHistoryIndexAtom,
  undoRedoAbilityAtom,
} from '@/store/segmentHistoryStore.ts';
import { IoSaveSharp } from 'react-icons/io5';

const TagInfoSwitch = ({
  w = 'full',
  justify = 'space-between',
  ...stackProps
}: StackProps) => {
  const [isTagInfoMode, setTagInfoMode] = useAtom(tagInfoModeAtom);
  return (
    <HStack {...stackProps} w={w} justify={justify}>
      <FormLabel noOfLines={1}>태그 정보 툴팁</FormLabel>
      <Switch
        isChecked={isTagInfoMode}
        onChange={() => setTagInfoMode(!isTagInfoMode)}
      />
    </HStack>
  );
};

const AbbrInfoSwitch = ({
  w = 'full',
  justify = 'space-between',
  ...stackProps
}: StackProps) => {
  const [isAbbrInfoMode, setIsAbbrInfoMode] = useAtom(abbrInfoModeAtom);
  return (
    <HStack {...stackProps} w={w} justify={justify}>
      <FormLabel noOfLines={1}>태그 약어 툴팁</FormLabel>
      <Switch
        isChecked={isAbbrInfoMode}
        onChange={() => setIsAbbrInfoMode(!isAbbrInfoMode)}
      />
    </HStack>
  );
};

const DeleteButton = () => {
  const [isDeleteMode, toggleDeleteMode] = useAtom(toggleDeleteModeActionAtom);
  return (
    <IconButton
      variant="solid"
      colorScheme={isDeleteMode ? 'blue' : 'gray'}
      aria-label="Delete Tag"
      icon={<BsFillEraserFill />}
      onClick={toggleDeleteMode}
    />
  );
};

const UndoButton = () => {
  const { canUndo } = useAtomValue(undoRedoAbilityAtom);
  const setSegmentHistoryIndex = useSetAtom(segmentHistoryIndexAtom);
  return (
    <IconButton
      variant="solid"
      aria-label="Undo the last action"
      icon={<ImUndo />}
      isDisabled={!canUndo}
      onClick={() => setSegmentHistoryIndex((prev) => prev - 1)}
    />
  );
};

const RedoButton = () => {
  const { canRedo } = useAtomValue(undoRedoAbilityAtom);
  const setSegmentHistoryIndex = useSetAtom(segmentHistoryIndexAtom);
  return (
    <IconButton
      variant="solid"
      aria-label="Redo the last undone action"
      icon={<ImRedo />}
      isDisabled={!canRedo}
      onClick={() => setSegmentHistoryIndex((prev) => prev + 1)}
    />
  );
};

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
