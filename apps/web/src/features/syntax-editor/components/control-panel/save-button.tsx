import { IconButton } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSaveSharp } from 'react-icons/io5';

import { ConfirmPopover } from '@/base';
import {
  CONTROL_OPEN_POPUP_DELAY,
  isSegmentTouchedAtom,
  SAVE_SEGMENT_DELAY,
  SAVE_SEGMENT_SUCCESS_TOAST_DURATION,
  saveHistorySegmentAtom,
} from '@/features/syntax-editor';
import { showToast } from '@/lib';

export default function SaveButton() {
  const { t } = useTranslation();
  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const saveHistorySegment = useSetAtom(saveHistorySegmentAtom);

  const [isLoading, setIsLoading] = useState(false);

  const onSave = () => {
    if (!saveHistorySegment()) {
      showToast({ title: t('editor.sentenceRemoved'), status: 'error' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast({
        title: t('editor.saved'),
        status: 'success',
        duration: SAVE_SEGMENT_SUCCESS_TOAST_DURATION,
      });
    }, SAVE_SEGMENT_DELAY);
  };

  return (
    <ConfirmPopover
      onConfirm={onSave}
      headerText={t('editor.saveConfirm')}
      tooltipLabel={t('editor.save')}
      tooltipDelay={CONTROL_OPEN_POPUP_DELAY}
    >
      <IconButton
        variant="subtle"
        aria-label={t('editor.save')}
        disabled={!isTouched}
        loading={isLoading}
      >
        <IoSaveSharp />
      </IconButton>
    </ConfirmPopover>
  );
}
