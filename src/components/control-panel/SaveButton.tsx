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
import { useParams } from 'react-router-dom';
import { AnalysisPathParams } from '@/types/analysis';

export default function SaveButton() {
  const toast = useToast();
  const { source, index } = useParams<AnalysisPathParams>();

  const isTouched = useAtomValue(isSegmentTouchedAtom);
  const saveHistorySegment = useSetAtom(saveHistorySegmentAtom);

  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
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
