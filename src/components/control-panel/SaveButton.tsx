import { IoSaveSharp } from 'react-icons/io5';
import { IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  isSegmentTouchedAtom,
  saveHistorySegmentAtom,
} from '@/store/segmentHistoryStore';
import { useState } from 'react';
import {
  SAVE_SEGMENT_DELAY,
  SAVE_SEGMENT_SUCCESS_TOAST_DURATION,
} from '@/constants/config';

export default function SaveButton() {
  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const [isLoading, setIsLoading] = useState(false);
  const saveHistorySegment = useSetAtom(saveHistorySegmentAtom);
  const toast = useToast();

  const onClick = () => {
    setIsLoading(true);
    saveHistorySegment();
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
    <Tooltip label="태깅 저장" openDelay={200}>
      <IconButton
        variant="solid"
        aria-label="Save your tagging result"
        icon={<IoSaveSharp />}
        onClick={onClick}
        isDisabled={!isTouched}
        isLoading={isLoading}
      />
    </Tooltip>
  );
}
