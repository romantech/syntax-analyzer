import { FormLabel, HStack, StackProps, Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { tagInfoModeAtom } from '@/features/syntax-editor';

export default function TagInfoSwitch({
  w = 'full',
  justify = 'space-between',
  ...stackProps
}: StackProps) {
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
}
