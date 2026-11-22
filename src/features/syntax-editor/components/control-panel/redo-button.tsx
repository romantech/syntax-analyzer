import { IconButton } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { ImRedo } from 'react-icons/im';

import { clearSelection, Tooltip } from '@/base';
import { CONTROL_OPEN_POPUP_DELAY, undoRedoActionAtom } from '@/features/syntax-editor';

export default function RedoButton() {
  const { t } = useTranslation();
  const [actionable, action] = useAtom(undoRedoActionAtom);
  const onClick = () => {
    action('redo');
    clearSelection();
  };

  return (
    <Tooltip label={t('editor.redo')} openDelay={CONTROL_OPEN_POPUP_DELAY}>
      <IconButton
        variant="subtle"
        aria-label={t('editor.redo')}
        disabled={!actionable.redo}
        onClick={onClick}
      >
        <ImRedo />
      </IconButton>
    </Tooltip>
  );
}
