import {
  randomSentenceFormSchema,
  RandomSentenceFormValues,
} from '@/features/syntax-analyzer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  RandomSentenceParams,
  useRandomSentence,
} from '@/features/syntax-analyzer/api';
import { useState } from 'react';
import { useBoolean } from '@chakra-ui/react';

const defaultValues = randomSentenceFormSchema.cast({});
const { keyword, ...rest } = defaultValues;
const defaultParams = rest;

export default function useRandomSentenceForm() {
  const [params, setParams] = useState<RandomSentenceParams>(defaultParams);
  const [readyToFetch, setReadyToFetch] = useBoolean();

  const methods = useForm<RandomSentenceFormValues>({
    /** yup 스키마의 기본값 설정
     * @see https://github.com/orgs/react-hook-form/discussions/1936
     * */
    defaultValues,
    resolver: yupResolver(randomSentenceFormSchema),
    reValidateMode: 'onSubmit',
  });

  const { data, isFetching, refetch } = useRandomSentence(params, {
    enabled: readyToFetch,
    staleTime: Infinity,
  });

  const { getValues } = methods;

  const generateRandomSentences = () => {
    const [topics, sent_count] = getValues(['topics', 'sent_count']);
    setParams({ topics, sent_count });

    if (!readyToFetch) setReadyToFetch.on();
    refetch();
  };

  return { methods, data, isFetching, generateRandomSentences };
}
