import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  AnalysisFormValues,
  createAnalysisFormSchema,
  REMAINING_COUNT_BASE_KEY,
  useCreateAnalysis,
  useRemainingCount,
} from '@/features/syntax-analyzer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { nanoid } from 'nanoid';
import { getSyntaxTaggingPath } from '@/routes';
import { useAtom, useSetAtom } from 'jotai';
import { currentAnalysisAtom, userAnalysisListAtom } from '@/store';
import { expandAbbreviations, tokenizer } from '@/base';
import { useDisclosure } from '@chakra-ui/react';
import { TAnalysis } from '@/features/syntax-editor';

const getDefaultValue = (count: number): AnalysisFormValues => ({
  sentence: '',
  model: count > 2 ? 'gpt-4' : 'gpt-3.5-turbo',
});

const updateAnalysisMetaData = (analysis: TAnalysis) => ({
  ...analysis,
  id: nanoid(),
  createdAt: new Date().toISOString(),
});

export default function useCreateAnalysisForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isOpen: isModalOpen,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();

  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);
  const [userAnalysisList, setUserAnalysisList] = useAtom(userAnalysisListAtom);

  const { data: remainingCount = 0 } = useRemainingCount({
    select: ({ count }) => count,
    suspense: true,
  });

  const useFormResults = useForm<AnalysisFormValues>({
    defaultValues: getDefaultValue(remainingCount),
    resolver: yupResolver(createAnalysisFormSchema),
  });

  const useMutationResults = useCreateAnalysis({
    onMutate: closeModal,
    onSuccess: async (analysis) => {
      const updatedAnalysis = updateAnalysisMetaData(analysis);

      setUserAnalysisList([updatedAnalysis, ...userAnalysisList]);
      setCurrentAnalysis(updatedAnalysis);

      await queryClient.invalidateQueries(REMAINING_COUNT_BASE_KEY);
      navigate(getSyntaxTaggingPath('user', 0));
    },
  });

  const { getValues, handleSubmit } = useFormResults;
  const { mutate } = useMutationResults;

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
    ...useFormResults,
    ...useMutationResults,
  };
}
