import { HStack, Input, Stack, StackProps } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import {
  AddTopicForm,
  GenerateButton,
  RandomSentenceCount,
  RandomSentenceInstructions,
  RandomSentenceList,
  TopicTagList,
  useRandomSentenceForm,
} from '@/features/syntax-analyzer';
import { CenteredDivider } from '@/base';
import { Suspense } from 'react';

interface RandomSentenceFormProps extends StackProps {
  showInstructions?: boolean;
}

export default function RandomSentenceForm({
  showInstructions = true,
  ...stackProps
}: RandomSentenceFormProps) {
  const { methods, isFetching, data, generateSentences } =
    useRandomSentenceForm();

  return (
    <Stack w="full" maxW={690} gap={4} {...stackProps}>
      <RandomSentenceInstructions hidden={!showInstructions} />
      <FormProvider {...methods}>
        <HStack>
          <AddTopicForm />
          <CenteredDivider h="38px" px={3} orientation="vertical" />
          <HStack>
            <RandomSentenceCount />
            <Suspense fallback={<GenerateButton.Skeleton />}>
              <GenerateButton
                onClick={generateSentences}
                isLoading={isFetching}
              />
            </Suspense>
          </HStack>
          <Input {...methods.register('topics')} hidden />
        </HStack>
        <TopicTagList mt={-2} maxW={590} />
      </FormProvider>
      <RandomSentenceList data={data} query={methods.getValues('topics')} />
    </Stack>
  );
}
