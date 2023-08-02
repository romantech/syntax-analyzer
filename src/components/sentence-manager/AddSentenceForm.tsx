import { Button, FormControl, HStack, useDisclosure } from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { addSentenceSchema } from '@/constants/scheme';
import { addUserAnalysisActionAtom } from '@/store/analysisStore';
import { useSetAtom } from 'jotai';
import { ConfirmModal } from '@/components/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { VoidFunc } from '@/types/common';
import SentenceInput from './SentenceInput';

const DEFAULT_VALUE = { sentence: '' };

interface AddSentenceProps {
  onConfirmEffect?: VoidFunc;
}

export default function AddSentenceForm({ onConfirmEffect }: AddSentenceProps) {
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
    onConfirmEffect?.();
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onOpen)} style={{ width: '100%' }}>
        <FormControl isInvalid={!!errors.sentence}>
          <HStack align="start">
            <SentenceInput
              {...register('sentence')}
              errorMessage={errors.sentence?.message}
            />
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
