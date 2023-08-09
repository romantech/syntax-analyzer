import { forwardRef, PropsWithChildren } from 'react';
import { useAtomValue } from 'jotai';
import { deleteModeAtom, useSentenceHandler } from '@/features/syntax-editor';
import { Text, useColorModeValue } from '@chakra-ui/react';

const Sentence = forwardRef<HTMLParagraphElement, PropsWithChildren>(
  ({ children }, ref) => {
    const isDeleteMode = useAtomValue(deleteModeAtom);
    const handlers = useSentenceHandler();
    const textColor = useColorModeValue('gray.700', 'gray.300');
    return (
      <Text
        fontSize="3xl"
        fontWeight="bold"
        ref={ref}
        whiteSpace="nowrap"
        color={textColor}
        cursor={isDeleteMode ? 'pointer' : 'text'}
        {...handlers}
      >
        {children}
      </Text>
    );
  },
);
Sentence.displayName = 'Sentence';

export default Sentence;
