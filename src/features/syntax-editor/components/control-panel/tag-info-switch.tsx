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
      <FormLabel id="tag-information" noOfLines={1}>
        태그 정보 툴팁
      </FormLabel>
      <Switch
        aria-labelledby="tag-information"
        colorScheme="teal"
        isChecked={isTagInfoMode}
        onChange={() => setTagInfoMode((prev) => !prev)}
      />
    </HStack>
  );
}
