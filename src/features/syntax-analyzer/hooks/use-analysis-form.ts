import { useNavigate } from 'react-router-dom';
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
import { useEffect } from 'react';

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

  const {
    isOpen: isModalOpen,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();

  const { data: remainingCount = 0 } = useRemainingCountQuery({
    select: ({ analysis }) => analysis,
    suspense: true,
    // observer 레벨에서 동작하는 가짜 데이터 / 캐시 저장 안함
    placeholderData: { analysis: 0, random_sentence: 0 },
  });

  const formResults = useForm<AnalysisFormValues>({
    resolver: yupResolver(createAnalysisFormSchema),
  });

  const mutationResults = useCreateAnalysisMutation({
    onMutate: closeModal,
    onSuccess: (data) => {
      const analysis = updateAnalysisMetaData(data);
      navigate(getSyntaxEditorPath('user', 0), { state: { analysis } });
    },
    meta: { invalidateQueries: REMAINING_COUNT_BASE_KEY },
  });

  const { getValues, handleSubmit, reset } = formResults;
  const { mutate } = mutationResults;

  useEffect(() => {
    reset(getDefaultValue(remainingCount));
  }, [remainingCount, reset]);

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
