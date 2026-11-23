import { Box, type BoxProps, Button, Field, HStack, useDisclosure } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ConfirmModal, type VoidFunc } from '@/base';
import { SENTENCE_CONTROL_HEIGHT, SentenceInput } from '@/features/syntax-analyzer';
import { addSentenceFormSchema } from '@/features/syntax-analyzer/schemes/analysis-form-schema';
import { addUserAnalysisActionAtom } from '@/features/syntax-editor';
import { generateAnalysis } from '@/features/syntax-editor/helpers/analysis';

const defaultValues = addSentenceFormSchema.cast({});
const resolver = yupResolver(addSentenceFormSchema);
const formProps = { resolver, defaultValues };

interface AddSentenceProps extends BoxProps {
  onConfirmEffect?: VoidFunc;
}

export default function AddSentenceForm({ onConfirmEffect, ...boxProps }: AddSentenceProps) {
  const { t } = useTranslation();
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
            {t('editor.add')}
          </Button>
        </HStack>
      </Field.Root>
      <ConfirmModal
        isOpen={open}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmLabel={t('editor.add')}
        headerContent={t('editor.addTitle')}
        bodyContent={t('editor.addConfirm')}
      />
    </Box>
  );
}
