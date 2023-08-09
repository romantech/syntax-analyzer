import {
  Box,
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

const DEFAULT_VALUE = { sentence: '' };

interface AddSentenceProps {
  onConfirmEffect?: VoidFunc;
}

export default function AddSentenceForm({ onConfirmEffect }: AddSentenceProps) {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<typeof DEFAULT_VALUE>({
    resolver: yupResolver(addSentenceFormSchema),
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
    <Box as="form" onSubmit={handleSubmit(onOpen)} w="full">
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
