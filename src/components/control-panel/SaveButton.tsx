import { IoSaveSharp } from 'react-icons/io5';
import { IconButton, useToast } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { isTouchedAtom, saveSegmentAtom } from '@/store/segmentHistoryStore';
import { useState } from 'react';

export default function SaveButton() {
  const isTouched = useAtomValue(isTouchedAtom);
  const [isLoading, setIsLoading] = useState(false);
  const saveSegment = useSetAtom(saveSegmentAtom);
  const toast = useToast();

  const onClick = () => {
    setIsLoading(true);
    saveSegment();
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '저장 성공',
        status: 'success',
        duration: 5000,
        isClosable: true,
        containerStyle: {
          position: 'relative',
          bottom: 5,
        },
      });
    }, 1000);
  };

  return (
    <IconButton
      variant="solid"
      aria-label="Save your tagging result"
      icon={<IoSaveSharp />}
      onClick={onClick}
      isDisabled={!isTouched}
      isLoading={isLoading}
    />
  );
}
