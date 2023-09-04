import { forwardRef, PropsWithChildren } from 'react';

import { Text, useColorModeValue } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

import { deleteModeAtom, useSentenceHandler } from '@/features/syntax-editor';

const Sentence = forwardRef<HTMLParagraphElement, PropsWithChildren>(
  function Sentence({ children }, ref) {
    const isDeleteMode = useAtomValue(deleteModeAtom);
    const handlers = useSentenceHandler();
    const textColor = useColorModeValue('gray.700', 'gray.300');

    return (
      <Text
        ref={ref}
        fontSize="3xl"
        fontWeight="bold"
        whiteSpace="nowrap"
        color={textColor}
        cursor={isDeleteMode ? 'pointer' : 'auto'}
        {...handlers}
      >
        {children}
      </Text>
    );
  },
);

export default Sentence;
