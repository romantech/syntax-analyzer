import { FormLabel, HStack, type StackProps, Switch } from '@chakra-ui/react';
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
      <FormLabel id="tag-abbreviations" noOfLines={1} m={0} fontSize="sm">
        태그 약어 툴팁
      </FormLabel>
      <Switch
        minH="44px"
        display="flex"
        alignItems="center"
        aria-labelledby="tag-abbreviations"
        colorScheme="teal"
        isChecked={isAbbrInfoMode}
        onChange={() => setIsAbbrInfoMode((prev) => !prev)}
      />
    </HStack>
  );
}
