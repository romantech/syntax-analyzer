import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  createAnalysisFormSchema,
  REMAINING_COUNT_BASE_KEY,
  useCreateAnalysisMutation,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { nanoid } from 'nanoid';
import { getSyntaxEditorPath } from '@/routes';
import { expandAbbreviations, tokenizer } from '@/base';
import { useDisclosure } from '@chakra-ui/react';
import { TAnalysis } from '@/features/syntax-editor';

export type AnalysisModel = 'gpt-3.5-turbo' | 'gpt-4';
export type AnalysisFormValues = { model: AnalysisModel; sentence: string };

const getDefaultValue = (count: number): AnalysisFormValues => ({
  sentence: '',
  model: count > 2 ? 'gpt-4' : 'gpt-3.5-turbo',
});

const updateAnalysisMetaData = (analysis: TAnalysis) => ({
  ...analysis,
  id: nanoid(),
  createdAt: new Date().toISOString(),
});

export const useAnalysisForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isOpen: isModalOpen,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();

  const { data: remainingCount = 0 } = useRemainingCountQuery({
    select: ({ count }) => count,
    suspense: true,
  });

  const formResults = useForm<AnalysisFormValues>({
    defaultValues: getDefaultValue(remainingCount),
    resolver: yupResolver(createAnalysisFormSchema),
  });

  const mutationResults = useCreateAnalysisMutation({
    onMutate: closeModal,
    onSuccess: async (analysis) => {
      const updatedAnalysis = updateAnalysisMetaData(analysis);

      await queryClient.invalidateQueries(REMAINING_COUNT_BASE_KEY);
      navigate(getSyntaxEditorPath('user', 0), {
        state: { analysis: updatedAnalysis },
      });
    },
  });

  const { getValues, handleSubmit } = formResults;
  const { mutate } = mutationResults;

  const onSubmitConfirm = () => {
    const { model, sentence } = getValues();
    const tokenized = tokenizer(expandAbbreviations(sentence));
    const payload = { model, sentence: tokenized };
    mutate(payload);
  };

  const onSubmit = handleSubmit(openModal);

  return {
    onSubmitConfirm,
    onSubmit,
    isModalOpen,
    closeModal,
    remainingCount,
    ...formResults,
    ...mutationResults,
  };
};
