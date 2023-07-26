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
  abbrInfoMode,
  deleteModeAtom,
  tagInfoMode,
} from '@/store/controlPanelStore.ts';
import { BsFillEraserFill } from 'react-icons/bs';

export default function ControlPanel() {
  const [isTagInfoMode, setTagInfoMode] = useAtom(tagInfoMode);
  const [isAbbrInfoMode, setIsAbbrInfoMode] = useAtom(abbrInfoMode);
  const [isDeleteMode, setIsDeleteMode] = useAtom(deleteModeAtom);

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
            onClick={() => setIsDeleteMode((prev) => !prev)}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
