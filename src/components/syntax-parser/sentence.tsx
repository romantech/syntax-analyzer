import { forwardRef, PropsWithChildren } from 'react';
import { useAtomValue } from 'jotai';
import { deleteModeAtom } from '@/store/control-panel-store';
import { useSentenceHandlers } from '@/hooks';
import { Text, useColorModeValue } from '@chakra-ui/react';

const Sentence = forwardRef<HTMLParagraphElement, PropsWithChildren>(
  ({ children }, ref) => {
    const isDeleteMode = useAtomValue(deleteModeAtom);
    const handlers = useSentenceHandlers();
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
