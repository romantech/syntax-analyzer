import { Box, type BoxProps, Button, Field, HStack, useDisclosure } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';

import { ConfirmModal, type VoidFunc } from '@/base';
import {
  addSentenceFormSchema,
  SENTENCE_CONTROL_HEIGHT,
  SentenceInput,
} from '@/features/syntax-analyzer';
import { addUserAnalysisActionAtom } from '@/features/syntax-editor';
import { generateAnalysis } from '@/features/syntax-editor/helpers/analysis';

const defaultValues = addSentenceFormSchema.cast({});
const resolver = yupResolver(addSentenceFormSchema);
const formProps = { resolver, defaultValues };

interface AddSentenceProps extends BoxProps {
  onConfirmEffect?: VoidFunc;
}

export default function AddSentenceForm({ onConfirmEffect, ...boxProps }: AddSentenceProps) {
  const { register, handleSubmit, getValues, reset, formState } = useForm(formProps);

  const { open, onOpen, onClose } = useDisclosure();
  const addAnalysis = useSetAtom(addUserAnalysisActionAtom);

  const onConfirm = () => {
    addAnalysis(generateAnalysis(getValues('sentence'), 'user'));
    onConfirmEffect?.();
    onClose();
    reset();
  };

  const { errors, isSubmitting } = formState;

  return (
    <Box as="form" w="full" onSubmit={handleSubmit(onOpen)} {...boxProps}>
      <Field.Root invalid={!!errors.sentence}>
        <HStack align="start" w="full">
          <SentenceInput {...register('sentence')} errorMessage={errors.sentence?.message} />
          <Button
            type="submit"
            loading={isSubmitting}
            flexShrink={0}
            size="lg"
            h={SENTENCE_CONTROL_HEIGHT}
            fontSize="md"
          >
            추가
          </Button>
        </HStack>
      </Field.Root>
      <ConfirmModal
        isOpen={open}
        onClose={onClose}
        onConfirm={onConfirm}
        headerContent="영어 문장 추가"
        bodyContent="입력한 영어 문장을 추가하시겠습니까?"
      />
    </Box>
  );
}
