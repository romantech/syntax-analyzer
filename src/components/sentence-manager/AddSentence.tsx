import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { addSentenceSchema } from '@/constants/scheme';
import { addUserAnalysisActionAtom } from '@/store/analysisStore';
import { useSetAtom } from 'jotai';
import { ConfirmModal } from '@/components/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { PiTextTBold } from 'react-icons/pi';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

const DEFAULT_VALUE = { sentence: '' };

export default function AddSentence() {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<typeof DEFAULT_VALUE>({
    resolver: yupResolver(addSentenceSchema),
    defaultValues: DEFAULT_VALUE,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const addAnalysis = useSetAtom(addUserAnalysisActionAtom);

  const onConfirm = () => {
    addAnalysis({ sentence: getValues('sentence'), source: 'user' });
    reset();
    onClose();
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onOpen)} style={{ width: '100%' }}>
        <FormControl isInvalid={!!errors.sentence}>
          <HStack align="start">
            <Box flexGrow={1}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <PiTextTBold />
                </InputLeftElement>
                <Input
                  {...register('sentence')}
                  placeholder="90자 미만의 영어 문장을 입력해주세요"
                  maxLength={90}
                />
              </InputGroup>
              <FormErrorMessage>{errors.sentence?.message}</FormErrorMessage>
              <FormHelperText>{`축약 표현은 자동으로 풀어집니다 (I'll → I will)`}</FormHelperText>
            </Box>
            <Button size="lg" type="submit" isLoading={isSubmitting}>
              추가
            </Button>
          </HStack>
        </FormControl>
      </form>
      <DevTool control={control} />
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        headerContent="영어 문장 추가"
        bodyContent="입력한 영어 문장을 추가 하시겠습니까?"
      />
    </Fragment>
  );
}
