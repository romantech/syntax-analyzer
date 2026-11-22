import { IconButton } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { MdOutlineRestore } from 'react-icons/md';

import { ConfirmPopover } from '@/base';
import {
  CONTROL_OPEN_POPUP_DELAY,
  isSegmentTouchedAtom,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';

export default function ResetButton() {
  const { t } = useTranslation();
  const { initializer } = useSyntaxEditorInitializer();
  const isTouched = useAtomValue(isSegmentTouchedAtom);

  return (
    <ConfirmPopover
      onConfirm={initializer}
      headerText={t('editor.resetConfirm')}
      tooltipLabel={t('editor.reset')}
      tooltipDelay={CONTROL_OPEN_POPUP_DELAY}
    >
      <IconButton
        variant="subtle"
        aria-label={t('editor.reset')}
        disabled={!isTouched}
        fontSize="22px"
      >
        <MdOutlineRestore />
      </IconButton>
    </ConfirmPopover>
  );
}
