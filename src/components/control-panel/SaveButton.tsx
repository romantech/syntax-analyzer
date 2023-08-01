import { IoSaveSharp } from 'react-icons/io5';
import { IconButton } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { currentHistorySegmentAtom } from '@/store/segmentHistoryStore';
import { currentAnalysisAtom } from '@/store/analysisStore';

export default function SaveButton() {
  const currentHistorySegment = useAtomValue(currentHistorySegmentAtom);
  const currentAnalysis = useAtomValue(currentAnalysisAtom);
  const onClick = () => {};
  return (
    <IconButton
      variant="solid"
      aria-label="Save your tagging result"
      icon={<IoSaveSharp />}
      onClick={onClick}
    />
  );
}
