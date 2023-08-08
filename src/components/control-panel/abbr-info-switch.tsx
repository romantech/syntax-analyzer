import { FormLabel, HStack, StackProps, Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { abbrInfoModeAtom } from '@/store/control-panel-store';

export default function AbbrInfoSwitch({
  w = 'full',
  justify = 'space-between',
  ...stackProps
}: StackProps) {
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
}
