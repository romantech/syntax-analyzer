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
        <InputLeftElement pointerEvents="none">
          <PiTextTBold />
        </InputLeftElement>
        <Input
          aria-label="영어 문장"
          enterKeyHint="done"
          placeholder={`${MAX_SENTENCE_LENGTH}자 미만의 영어 문장을 입력해 주세요`}
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
