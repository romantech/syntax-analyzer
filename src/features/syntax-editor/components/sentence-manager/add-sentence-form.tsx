import {
  Box,
  BoxProps,
  Button,
  FormControl,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import {
  addUserAnalysisActionAtom,
  SentenceInput,
} from '@/features/syntax-editor';
import { useSetAtom } from 'jotai';
import { ConfirmModal, VoidFunc } from '@/base';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { addSentenceFormSchema } from '@/features/syntax-analyzer';

const defaultValues = addSentenceFormSchema.cast({});
const resolver = yupResolver(addSentenceFormSchema);
const formProps = { resolver, defaultValues };

interface AddSentenceProps extends BoxProps {
  onConfirmEffect?: VoidFunc;
}

export default function AddSentenceForm({
  onConfirmEffect,
  ...boxProps
}: AddSentenceProps) {
  const { register, handleSubmit, getValues, reset, formState } =
    useForm<typeof defaultValues>(formProps);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const addAnalysis = useSetAtom(addUserAnalysisActionAtom);

  const onConfirm = () => {
    addAnalysis({ sentence: getValues('sentence'), source: 'user' });
    onConfirmEffect?.();
    onClose();
    reset();
  };

  const { errors, isSubmitting } = formState;

  return (
    <Box as="form" w="full" onSubmit={handleSubmit(onOpen)} {...boxProps}>
      <FormControl isInvalid={!!errors.sentence}>
        <HStack align="start">
          <SentenceInput
            {...register('sentence')}
            errorMessage={errors.sentence?.message}
          />
          <Button type="submit" isLoading={isSubmitting} size="lg">
            추가
          </Button>
        </HStack>
      </FormControl>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        headerContent="영어 문장 추가"
        bodyContent="입력한 영어 문장을 추가 하시겠습니까?"
      />
    </Box>
  );
}
