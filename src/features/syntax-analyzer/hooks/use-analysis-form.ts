import { useDisclosure } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import type { InferType } from 'yup';

import { ensurePeriod, expandAbbreviations, removeThousandSeparator, tokenizer } from '@/base';
import {
  createAnalysisFormSchema,
  REMAINING_COUNT_BASE_KEY,
  useCreateAnalysisMutation,
  useInjectAnalysis,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';
import { updateAnalysisMetaData } from '@/features/syntax-editor';
import { useAppToast } from '@/lib';
import { getSyntaxEditorPath } from '@/routes';

export type AnalysisFormValues = InferType<typeof createAnalysisFormSchema>;

/**
 * Expands abbreviations and removes comma as a thousand separator from a sentence.
 *
 * @param {string} sentence - The sentence to be processed.
 * @return {string} The processed sentence.
 */
export const processSentence = (sentence: string): string => {
  const expanded = expandAbbreviations(ensurePeriod(sentence));
  return removeThousandSeparator(expanded);
};

export const useAnalysisForm = () => {
  const navigate = useNavigate();
  const toast = useAppToast();
  const { injectAnalysis } = useInjectAnalysis();

  const { isOpen: isModalOpen, onClose: closeModal, onOpen: openModal } = useDisclosure();

  const { data: remainingCount = 0 } = useRemainingCountQuery({
    select: ({ analysis }) => analysis,
    // useSuspenseQuery는 placeholderData 미지원
    // 참고로 placeholderData는 observer 레벨에서 동작하는 가짜 데이터로 캐시에 저장 안됨
    // placeholderData: { analysis: 0, random_sentence: 0 },
  });

  const formResults = useForm({
    resolver: yupResolver(createAnalysisFormSchema),
    defaultValues: createAnalysisFormSchema.cast({}),
  });

  const mutationResults = useCreateAnalysisMutation({
    onMutate: closeModal,
    onSuccess: (data) => {
      const analysis = updateAnalysisMetaData(data);
      injectAnalysis(analysis);

      navigate(getSyntaxEditorPath('user', 0));
      toast({ title: '문장 분석을 완료했습니다', status: 'success', duration: 4000 });
    },
    meta: { invalidateQueries: REMAINING_COUNT_BASE_KEY },
  });

  const { getValues, handleSubmit } = formResults;
  const { mutate } = mutationResults;

  const onSubmitConfirm = () => {
    const { model, sentence } = getValues();
    const tokenized = tokenizer(processSentence(sentence));
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
