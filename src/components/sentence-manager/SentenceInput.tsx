import {
  Box,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
} from '@chakra-ui/react';
import { PiTextTBold } from 'react-icons/pi';
import { forwardRef } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const DEFAULT_HELPER_MESSAGE = `축약 표현은 자동으로 풀어집니다 (I'll → I will)`;

interface SentenceInputProps extends InputProps {
  errorMessage?: string;
  helperMessage?: string;
}

const SentenceInput = forwardRef<HTMLInputElement, SentenceInputProps>(
  function SentenceInput(
    {
      errorMessage,
      helperMessage = DEFAULT_HELPER_MESSAGE,
      size = 'lg',
      ...inputProps
    },
    ref,
  ) {
    const [parent] = useAutoAnimate({ duration: 180 });
    return (
      <Box flexGrow={1} ref={parent}>
        <InputGroup size={size}>
          <InputLeftElement pointerEvents="none">
            <PiTextTBold />
          </InputLeftElement>
          <Input
            placeholder="90자 미만의 영어 문장을 입력해주세요"
            maxLength={90}
            {...inputProps}
            ref={ref}
          />
        </InputGroup>
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
        <FormHelperText color="gray.500">{helperMessage}</FormHelperText>
      </Box>
    );
  },
);

export default SentenceInput;
