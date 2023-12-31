import { useState } from 'react';

import { IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { IoSaveSharp } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import { ConfirmPopover } from '@/base';
import {
  AnalysisPathParams,
  CONTROL_OPEN_POPUP_DELAY,
  isSegmentTouchedAtom,
  SAVE_SEGMENT_DELAY,
  SAVE_SEGMENT_SUCCESS_TOAST_DURATION,
  saveHistorySegmentAtom,
} from '@/features/syntax-editor';

export default function SaveButton() {
  const toast = useToast();
  const { source, index } = useParams<AnalysisPathParams>();

  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const saveHistorySegment = useSetAtom(saveHistorySegmentAtom);

  const [isLoading, setIsLoading] = useState(false);

  const onSave = () => {
    if (!source || !index) return;

    setIsLoading(true);
    saveHistorySegment({ source, index });
    setTimeout(() => {
      setIsLoading(false);
      toast({
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
    >
      {({ onOpen, isOpen }) => (
        <Tooltip
          label="태깅 저장"
          closeOnPointerDown
          isDisabled={isOpen}
          openDelay={CONTROL_OPEN_POPUP_DELAY}
        >
          <IconButton
            variant="solid"
            aria-label="Save your tagging result"
            icon={<IoSaveSharp />}
            onClick={onOpen}
            isDisabled={!isTouched}
            isLoading={isLoading}
          />
        </Tooltip>
      )}
    </ConfirmPopover>
  );
}
