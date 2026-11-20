import { HStack, Input, Stack, type StackProps } from '@chakra-ui/react';
import { Suspense } from 'react';
import { FormProvider } from 'react-hook-form';

import {
  AddTopicForm,
  GenerateButton,
  RandomSentenceInstructions,
  RandomSentenceList,
  SentenceCountPicker,
  TopicTagList,
  useRandomSentenceForm,
} from '@/features/syntax-analyzer';

interface RandomSentenceFormProps extends StackProps {
  showInstructions?: boolean;
}

export default function RandomSentenceForm({
  showInstructions = true,
  ...stackProps
}: RandomSentenceFormProps) {
  const { methods, isFetching, data, generateSentences } = useRandomSentenceForm();

  const { register, getValues } = methods;

  return (
    <Stack gap={4} {...stackProps}>
      <RandomSentenceInstructions hidden={!showInstructions} />
      <FormProvider {...methods}>
        <HStack flexWrap="wrap" align="start" columnGap={4} rowGap={3}>
          <AddTopicForm flex="1 1 320px" minW={0} />
          <HStack align="start">
            <SentenceCountPicker />
            <Suspense fallback={<GenerateButton.Skeleton />}>
              <GenerateButton onClick={generateSentences} loading={isFetching} />
            </Suspense>
          </HStack>
          <Input {...register('topics')} hidden />
        </HStack>
        <TopicTagList mt={-2} maxW={590} />
      </FormProvider>
      <RandomSentenceList data={data} query={getValues('topics')} />
    </Stack>
  );
}
