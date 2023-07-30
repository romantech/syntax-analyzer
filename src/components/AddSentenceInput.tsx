import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Input,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { ValidationError } from 'yup';
import { addSentenceSchema } from '@/constants/scheme';

export default function AddSentenceInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState(false);
  const errorMessage = useRef('');

  const onSubmit = async () => {
    const input = inputRef.current;
    if (!input) return;

    try {
      await addSentenceSchema.validate(input.value.trim());
    } catch (err) {
      if (err instanceof ValidationError) {
        errorMessage.current = err.errors[0];
        setIsError(true);
      }
    }
  };

  return (
    <FormControl isInvalid={isError}>
      <HStack align="start">
        <Box>
          <Input
            ref={inputRef}
            placeholder="90자 미만의 영어 문장을 입력해주세요"
            maxLength={90}
            onFocus={() => setIsError(false)}
            minW={500}
          />
          {isError ? (
            <FormErrorMessage>{errorMessage.current}</FormErrorMessage>
          ) : (
            <FormHelperText>{`축약 표현은 자동으로 풀어집니다 e.g. I'll -> I will`}</FormHelperText>
          )}
        </Box>
        <Button onClick={onSubmit}>추가</Button>
      </HStack>
    </FormControl>
  );
}
