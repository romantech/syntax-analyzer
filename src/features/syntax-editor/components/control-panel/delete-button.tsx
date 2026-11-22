import { IconButton } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { BsFillEraserFill } from 'react-icons/bs';

import { Tooltip } from '@/base';
import {
  CONTROL_OPEN_POPUP_DELAY,
  isDisableDeleteButtonAtom,
  toggleDeleteModeActionAtom,
} from '@/features/syntax-editor';

export default function DeleteButton() {
  const { t } = useTranslation();
  const [isDeleteMode, toggleDeleteMode] = useAtom(toggleDeleteModeActionAtom);
  const isDisableDeleteButton = useAtomValue(isDisableDeleteButtonAtom);

  return (
    <Tooltip label={t('editor.deleteTag')} openDelay={CONTROL_OPEN_POPUP_DELAY}>
      <IconButton
        variant={isDeleteMode ? 'outline' : 'subtle'}
        colorPalette={isDeleteMode ? 'teal' : 'gray'}
        aria-label={t('editor.deleteTag')}
        aria-pressed={isDeleteMode}
        onClick={toggleDeleteMode}
        disabled={isDisableDeleteButton}
      >
        <BsFillEraserFill />
      </IconButton>
    </Tooltip>
  );
}
