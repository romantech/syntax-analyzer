import { Flex, HStack, Switch, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { abbrInfoModeAtom, tagInfoModeAtom } from '@/features/syntax-editor/store';

function TooltipSwitch({
  label,
  preferenceAtom,
  isTapMode,
}: {
  label: string;
  preferenceAtom: typeof tagInfoModeAtom;
  isTapMode: boolean;
}) {
  const [checked, setChecked] = useAtom(preferenceAtom);
  const labelId = useId();

  return (
    <HStack gap={2} minW={0}>
      <Text as="span" id={labelId} fontSize="sm" fontWeight="medium">
        {label}
      </Text>
      <Switch.Root
        ids={{ label: labelId }}
        justifyContent="center"
        minH={isTapMode ? '44px' : 7}
        minW={isTapMode ? '44px' : undefined}
        flexShrink={0}
        cursor="pointer"
        colorPalette="teal"
        checked={checked}
        onCheckedChange={({ checked }) => setChecked(checked)}
      >
        <Switch.HiddenInput role="switch" />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
    </HStack>
  );
}

export default function TooltipSwitches({ isTapMode = false }: { isTapMode?: boolean }) {
  const { t } = useTranslation();

  return (
    <Flex align="center" wrap="wrap" columnGap={4} rowGap={isTapMode ? 0 : 1}>
      <TooltipSwitch
        label={t('editor.tagTooltip')}
        preferenceAtom={tagInfoModeAtom}
        isTapMode={isTapMode}
      />
      <TooltipSwitch
        label={t('editor.abbreviationTooltip')}
        preferenceAtom={abbrInfoModeAtom}
        isTapMode={isTapMode}
      />
    </Flex>
  );
}
