import { useAtom } from 'jotai';
import { Card, HStack, Switch, Text, VStack } from '@chakra-ui/react';
import {
  abbrTooltipModeAtom,
  tagTooltipModeAtom,
} from '@/store/controlPanelStore.ts';

export default function ControlPanel() {
  const [tagTooltipMode, setTagTooltipMode] = useAtom(tagTooltipModeAtom);
  const [abbrTooltipMode, setAbbrTooltipMode] = useAtom(abbrTooltipModeAtom);

  return (
    <Card h={175} w="20%" p={4} variant="outline">
      <VStack align="start" borderRadius={6}>
        <HStack minW="full" justify="space-between">
          <Text noOfLines={1}>태그 정보 툴팁</Text>
          <Switch
            isChecked={tagTooltipMode}
            onChange={() => setTagTooltipMode(!tagTooltipMode)}
          />
        </HStack>
        <HStack minW="full" justify="space-between">
          <Text noOfLines={1}>문장 약어 툴팁</Text>
          <Switch
            isChecked={abbrTooltipMode}
            onChange={() => setAbbrTooltipMode(!abbrTooltipMode)}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
