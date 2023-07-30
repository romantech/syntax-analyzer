import {
  AlertDialog,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Input,
  useDisclosure,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogOverlay,
  AlertDialogBody,
} from '@chakra-ui/react';
import { Fragment, useRef, useState } from 'react';
import { ValidationError } from 'yup';
import { addSentenceSchema } from '@/constants/scheme';
import { addAnalysisAtom } from '@/store/analysisStore';
import { useSetAtom } from 'jotai';

export default function AddSentenceInput() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorMessage = useRef('');
  const cancelRef = useRef(null);
  const addAnalysis = useSetAtom(addAnalysisAtom);

  const onSubmit = async () => {
    const input = inputRef.current;
    if (!input) return;

    try {
      await addSentenceSchema.validate(input.value.trim());
      onOpen();
    } catch (err) {
      if (err instanceof ValidationError) {
        errorMessage.current = err.errors[0];
        setIsError(true);
      }
    }
  };

  const onConfirm = () => {
    const input = inputRef.current;
    if (!input) return;
    addAnalysis(input.value.trim());
  };

  return (
    <Fragment>
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
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              영어 문장 추가
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              입력한 영어 문장을 추가 하시겠습니까?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme="blue" onClick={onConfirm} ml={3}>
                확인
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Fragment>
  );
}
