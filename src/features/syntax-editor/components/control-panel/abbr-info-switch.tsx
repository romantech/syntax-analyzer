import { Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';

import { abbrInfoModeAtom } from '@/features/syntax-editor';

export default function AbbrInfoSwitch({
  w = 'full',
  justifyContent = 'space-between',
  ...switchProps
}: Switch.RootProps) {
  const [isAbbrInfoMode, setIsAbbrInfoMode] = useAtom(abbrInfoModeAtom);
  return (
    <Switch.Root
      {...switchProps}
      w={w}
      justifyContent={justifyContent}
      minH="44px"
      colorPalette="teal"
      checked={isAbbrInfoMode}
      onCheckedChange={({ checked }) => setIsAbbrInfoMode(checked)}
    >
      <Switch.HiddenInput role="switch" />
      <Switch.Label lineClamp={1} fontSize="sm">
        약어 툴팁
      </Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}
