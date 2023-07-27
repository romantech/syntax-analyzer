import { useAtom } from 'jotai';
import {
  Card,
  HStack,
  IconButton,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  abbrInfoModeAtom,
  tagInfoModeAtom,
  toggleDeleteModeActionAtom,
} from '@/store/controlPanelStore.ts';
import { BsFillEraserFill } from 'react-icons/bs';

export default function ControlPanel() {
  const [isTagInfoMode, setTagInfoMode] = useAtom(tagInfoModeAtom);
  const [isAbbrInfoMode, setIsAbbrInfoMode] = useAtom(abbrInfoModeAtom);
  const [isDeleteMode, toggleDeleteMode] = useAtom(toggleDeleteModeActionAtom);

  return (
    <Card h={175} w="20%" p={4} variant="outline">
      <VStack align="start" borderRadius={6} gap={3}>
        <HStack minW="full" justify="space-between">
          <Text noOfLines={1}>태그 정보 툴팁</Text>
          <Switch
            isChecked={isTagInfoMode}
            onChange={() => setTagInfoMode(!isTagInfoMode)}
          />
        </HStack>
        <HStack minW="full" justify="space-between">
          <Text noOfLines={1}>태그 약어 툴팁</Text>
          <Switch
            isChecked={isAbbrInfoMode}
            onChange={() => setIsAbbrInfoMode(!isAbbrInfoMode)}
          />
        </HStack>
        <HStack>
          <IconButton
            variant="solid"
            colorScheme={isDeleteMode ? 'blue' : 'gray'}
            aria-label="Delete Tag"
            icon={<BsFillEraserFill />}
            onClick={toggleDeleteMode}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
