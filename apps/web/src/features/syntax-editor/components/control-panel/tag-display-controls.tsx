import { Flex, Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { showFullTagNamesAtom, tagInfoModeAtom } from '@/features/syntax-editor/store';

function TagDisplaySwitch({
  label,
  isTapMode,
  preferenceAtom,
}: {
  label: string;
  isTapMode: boolean;
  preferenceAtom: typeof tagInfoModeAtom;
}) {
  const [checked, setChecked] = useAtom(preferenceAtom);

  return (
    <Switch.Root
      minH={isTapMode ? '44px' : 7}
      cursor="pointer"
      colorPalette="teal"
      checked={checked}
      onCheckedChange={({ checked }) => setChecked(checked)}
    >
      <Switch.HiddenInput role="switch" />
      <Switch.Label fontSize="sm" fontWeight="medium">
        {label}
      </Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}

export default function TagDisplayControls({ isTapMode = false }: { isTapMode?: boolean }) {
  const { t } = useTranslation();

  return (
    <Flex align="center" wrap="wrap" columnGap={4} rowGap={isTapMode ? 0 : 1}>
      <TagDisplaySwitch
        label={t('editor.tagLabelFull')}
        preferenceAtom={showFullTagNamesAtom}
        isTapMode={isTapMode}
      />
      <TagDisplaySwitch
        label={t('editor.tagTooltip')}
        preferenceAtom={tagInfoModeAtom}
        isTapMode={isTapMode}
      />
    </Flex>
  );
}
