import { Text } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { forwardRef, type PropsWithChildren } from 'react';

import {
  deleteModeAtom,
  selectedTokenRangeAtom,
  useSentenceHandler,
} from '@/features/syntax-editor';

const Sentence = forwardRef<HTMLParagraphElement, PropsWithChildren<{ isTapMode: boolean }>>(
  function Sentence({ children, isTapMode }, ref) {
    const isDeleteMode = useAtomValue(deleteModeAtom);
    const setRange = useSetAtom(selectedTokenRangeAtom);
    const handlers = useSentenceHandler(isTapMode);

    return (
      <Text
        ref={ref}
        fontSize="3xl"
        fontWeight="bold"
        whiteSpace="nowrap"
        w="max-content"
        minW="full"
        userSelect={isTapMode ? 'none' : 'auto'}
        color="gray.700"
        _dark={{ color: 'gray.300' }}
        cursor={isDeleteMode ? 'pointer' : 'auto'}
        {...handlers}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setRange(null);
        }}
      >
        {children}
      </Text>
    );
  },
);

export default Sentence;
