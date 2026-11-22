import { HStack, Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { abbrInfoModeAtom, tagInfoModeAtom } from '@/features/syntax-editor/store';

function TooltipSwitch({
  label,
  preferenceAtom,
  gap,
}: {
  label: string;
  preferenceAtom: typeof tagInfoModeAtom;
  gap: number;
}) {
  const [checked, setChecked] = useAtom(preferenceAtom);

  return (
    <Switch.Root
      w="auto"
      justifyContent="start"
      gap={gap}
      minH="44px"
      colorPalette="teal"
      checked={checked}
      onCheckedChange={({ checked }) => setChecked(checked)}
    >
      <Switch.HiddenInput role="switch" />
      <Switch.Label lineClamp={1} fontSize="sm">
        {label}
      </Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}

export default function TooltipSwitches({ isTapMode = false }: { isTapMode?: boolean }) {
  const { t } = useTranslation();
  const gap = isTapMode ? 2.5 : 2;

  return (
    <HStack gap={4} flexWrap="wrap">
      <TooltipSwitch label={t('editor.tagTooltip')} preferenceAtom={tagInfoModeAtom} gap={gap} />
      <TooltipSwitch
        label={t('editor.abbreviationTooltip')}
        preferenceAtom={abbrInfoModeAtom}
        gap={gap}
      />
    </HStack>
  );
}
