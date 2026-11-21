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
        asChild
        ref={ref}
        fontSize={isTapMode ? '2xl' : '3xl'}
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
        <p translate="no" className="notranslate">
          {children}
        </p>
      </Text>
    );
  },
);

export default Sentence;
