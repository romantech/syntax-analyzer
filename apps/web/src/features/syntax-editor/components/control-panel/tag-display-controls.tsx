import { Flex, Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { showFullTagNamesAtom, tagInfoModeAtom } from '@/features/syntax-editor/store';

function TagDisplaySwitch({
  label,
  isTapMode,
  checked,
  onCheckedChange,
}: {
  label: string;
  isTapMode: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Switch.Root
      minH={isTapMode ? '44px' : 7}
      cursor="pointer"
      colorPalette="teal"
      checked={checked}
      onCheckedChange={({ checked }) => onCheckedChange(checked)}
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
  const [showFullTagNames, setShowFullTagNames] = useAtom(showFullTagNamesAtom);
  const [showTagDescriptions, setShowTagDescriptions] = useAtom(tagInfoModeAtom);

  return (
    <Flex align="center" wrap="wrap" columnGap={4} rowGap={isTapMode ? 0 : 1}>
      <TagDisplaySwitch
        label={t('editor.tagAbbreviations')}
        checked={!showFullTagNames}
        onCheckedChange={(checked) => setShowFullTagNames(!checked)}
        isTapMode={isTapMode}
      />
      <TagDisplaySwitch
        label={t('editor.tagDescriptions')}
        checked={showTagDescriptions}
        onCheckedChange={setShowTagDescriptions}
        isTapMode={isTapMode}
      />
    </Flex>
  );
}
