import { Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';

import { tagInfoModeAtom } from '@/features/syntax-editor';

export default function TagInfoSwitch({
  w = 'full',
  justifyContent = 'space-between',
  ...switchProps
}: Switch.RootProps) {
  const [isTagInfoMode, setTagInfoMode] = useAtom(tagInfoModeAtom);
  return (
    <Switch.Root
      {...switchProps}
      w={w}
      justifyContent={justifyContent}
      minH="44px"
      colorPalette="teal"
      checked={isTagInfoMode}
      onCheckedChange={({ checked }) => setTagInfoMode(checked)}
    >
      <Switch.HiddenInput role="switch" />
      <Switch.Label lineClamp={1} fontSize="sm">
        태그 툴팁
      </Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}
