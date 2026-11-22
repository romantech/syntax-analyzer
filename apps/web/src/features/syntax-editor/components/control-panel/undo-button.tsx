import { IconButton } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { ImUndo } from 'react-icons/im';

import { clearSelection, Tooltip } from '@/base';
import { CONTROL_OPEN_POPUP_DELAY, undoRedoActionAtom } from '@/features/syntax-editor';

export default function UndoButton() {
  const { t } = useTranslation();
  const [actionable, action] = useAtom(undoRedoActionAtom);
  const onClick = () => {
    action('undo');
    clearSelection();
  };

  return (
    <Tooltip label={t('editor.undo')} openDelay={CONTROL_OPEN_POPUP_DELAY}>
      <IconButton
        variant="subtle"
        aria-label={t('editor.undo')}
        disabled={!actionable.undo}
        onClick={onClick}
      >
        <ImUndo />
      </IconButton>
    </Tooltip>
  );
}
