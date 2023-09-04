import { FormLabel, HStack, StackProps, Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';

import { abbrInfoModeAtom } from '@/features/syntax-editor';

export default function AbbrInfoSwitch({
  w = 'full',
  justify = 'space-between',
  ...stackProps
}: StackProps) {
  const [isAbbrInfoMode, setIsAbbrInfoMode] = useAtom(abbrInfoModeAtom);
  return (
    <HStack {...stackProps} w={w} justify={justify}>
      <FormLabel id="tag-abbreviations" noOfLines={1}>
        태그 약어 툴팁
      </FormLabel>
      <Switch
        aria-labelledby="tag-abbreviations"
        colorScheme="teal"
        isChecked={isAbbrInfoMode}
        onChange={() => setIsAbbrInfoMode((prev) => !prev)}
      />
    </HStack>
  );
}
