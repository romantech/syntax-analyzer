import { Box, Field, Input, InputGroup, type InputProps } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { forwardRef } from 'react';
import { PiTextTBold } from 'react-icons/pi';

import { MAX_SENTENCE_LENGTH, SENTENCE_CONTROL_HEIGHT } from '@/features/syntax-analyzer/constants';

interface SentenceInputProps extends InputProps {
  errorMessage?: string;
}

const SentenceInput = forwardRef<HTMLInputElement, SentenceInputProps>(function SentenceInput(
  { errorMessage, size = 'lg', ...inputProps },
  ref,
) {
  const [parent] = useAutoAnimate({ duration: 180 });

  return (
    <Box flexGrow={1} minW={0} ref={parent}>
      <InputGroup
        startElement={<PiTextTBold />}
        startElementProps={{
          boxSize: SENTENCE_CONTROL_HEIGHT,
          p: 0,
          fontSize: 'xl',
          color: 'fg',
        }}
      >
        <Input
          aria-label="영어 문장"
          enterKeyHint="done"
          placeholder="영어 문장 입력"
          h={SENTENCE_CONTROL_HEIGHT}
          ps={SENTENCE_CONTROL_HEIGHT}
          size={size}
          fontSize="md"
          lineHeight="base"
          maxLength={MAX_SENTENCE_LENGTH}
          {...inputProps}
          ref={ref}
        />
      </InputGroup>
      <Field.ErrorText aria-live="polite" mt={2}>
        {errorMessage}
      </Field.ErrorText>
    </Box>
  );
});

export default SentenceInput;
