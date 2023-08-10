import { IoSaveSharp } from 'react-icons/io5';
import { IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  AnalysisPathParams,
  isSegmentTouchedAtom,
  SAVE_SEGMENT_DELAY,
  SAVE_SEGMENT_SUCCESS_TOAST_DURATION,
  saveHistorySegmentAtom,
} from '@/features/syntax-editor';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmPopover } from '@/base';

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
        isClosable: true,
        containerStyle: { position: 'relative', bottom: 5 },
      });
    }, SAVE_SEGMENT_DELAY);
  };

  return (
    <ConfirmPopover
      onConfirm={onSave}
      headerText="저장하시겠습니까?"
      gutter={-18}
    >
      {({ onOpen, isOpen }) => (
        <Tooltip
          label="태깅 저장"
          openDelay={200}
          closeOnPointerDown
          isDisabled={isOpen}
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
