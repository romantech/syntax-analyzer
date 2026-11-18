import {
  Box,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  type InputProps,
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { forwardRef } from 'react';
import { PiTextTBold } from 'react-icons/pi';

import { MAX_SENTENCE_LENGTH } from '@/features/syntax-analyzer/constants';

interface SentenceInputProps extends InputProps {
  errorMessage?: string;
  helperMessage?: string;
}

const SentenceInput = forwardRef<HTMLInputElement, SentenceInputProps>(function SentenceInput(
  { errorMessage, size = 'lg', ...inputProps },
  ref,
) {
  const [parent] = useAutoAnimate({ duration: 180 });

  return (
    <Box flexGrow={1} minW={0} ref={parent}>
      <InputGroup size={size}>
        <InputLeftElement boxSize={{ base: '2.75rem', lg: 12 }} pointerEvents="none" fontSize="xl">
          <PiTextTBold />
        </InputLeftElement>
        <Input
          aria-label="영어 문장"
          enterKeyHint="done"
          placeholder="영어 문장 입력"
          h={{ base: '2.75rem', lg: 12 }}
          pl={{ base: '2.75rem', lg: 12 }}
          fontSize={{ base: 'md', lg: 'lg' }}
          maxLength={MAX_SENTENCE_LENGTH}
          variant="filled"
          focusBorderColor="teal.300"
          {...inputProps}
          ref={ref}
        />
      </InputGroup>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </Box>
  );
});

export default SentenceInput;
