import { IconButton } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
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
  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const saveHistorySegment = useSetAtom(saveHistorySegmentAtom);

  const [isLoading, setIsLoading] = useState(false);

  const onSave = () => {
    if (!saveHistorySegment()) {
      showToast({ title: '다른 탭에서 문장이 삭제되어 저장할 수 없어요.', status: 'error' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast({
        title: '저장 성공',
        status: 'success',
        duration: SAVE_SEGMENT_SUCCESS_TOAST_DURATION,
      });
    }, SAVE_SEGMENT_DELAY);
  };

  return (
    <ConfirmPopover
      onConfirm={onSave}
      headerText="현재 태깅 내용을 저장하시겠습니까?"
      tooltipLabel="태깅 저장"
      tooltipDelay={CONTROL_OPEN_POPUP_DELAY}
    >
      <IconButton
        variant="subtle"
        aria-label="Save your tagging result"
        disabled={!isTouched}
        loading={isLoading}
      >
        <IoSaveSharp />
      </IconButton>
    </ConfirmPopover>
  );
}
