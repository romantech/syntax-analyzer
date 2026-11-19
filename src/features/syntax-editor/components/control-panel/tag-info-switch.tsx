import { FormLabel, HStack, type StackProps, Switch } from '@chakra-ui/react';
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
      <FormLabel id="tag-information" noOfLines={1} m={0} fontSize="sm">
        태그 툴팁
      </FormLabel>
      <Switch
        minH="44px"
        display="flex"
        alignItems="center"
        aria-labelledby="tag-information"
        colorScheme="teal"
        isChecked={isTagInfoMode}
        onChange={() => setTagInfoMode((prev) => !prev)}
      />
    </HStack>
  );
}
