import { Box, Field, Input, InputGroup, type InputProps } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PiTextTBold } from 'react-icons/pi';
import { SENTENCE_CONTROL_HEIGHT } from '@/features/syntax-analyzer/constants';
import { translateValidationMessage } from '@/features/syntax-analyzer/schemes/validation-messages';

interface SentenceInputProps extends InputProps {
  errorMessage?: string;
}

const SentenceInput = forwardRef<HTMLInputElement, SentenceInputProps>(function SentenceInput(
  { errorMessage, size = 'lg', ...inputProps },
  ref,
) {
  const { t } = useTranslation();
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
          aria-label={t('analyzer.sentence')}
          enterKeyHint="done"
          placeholder={t('analyzer.enterSentence')}
          h={SENTENCE_CONTROL_HEIGHT}
          ps={SENTENCE_CONTROL_HEIGHT}
          size={size}
          fontSize="md"
          lineHeight="base"
          {...inputProps}
          ref={ref}
        />
      </InputGroup>
      <Field.ErrorText aria-live="polite" mt={2}>
        {errorMessage && translateValidationMessage(t, errorMessage)}
      </Field.ErrorText>
    </Box>
  );
});

export default SentenceInput;
