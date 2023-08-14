import {
  Button,
  Center,
  Divider,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';
import { FormProvider } from 'react-hook-form';
import {
  AddTopicForm,
  FieldGroupHeader,
  RandomSentenceCount,
  RandomSentenceInstructions,
  RandomSentenceList,
  TopicTagList,
  useRandomSentenceForm,
} from '@/features/syntax-analyzer';

export default function RandomSentenceForm() {
  const { methods, isFetching, data, generateSentences } =
    useRandomSentenceForm();

  return (
    <Stack w="full" maxW={690} gap={4}>
      <FieldGroupHeader pb={0}>랜덤 문장 생성</FieldGroupHeader>
      <RandomSentenceInstructions />
      <FormProvider {...methods}>
        <HStack>
          <AddTopicForm />
          <Center h="38px" px={3}>
            <Divider orientation="vertical" />
          </Center>
          <HStack>
            <RandomSentenceCount />
            <Button
              onClick={generateSentences}
              leftIcon={<RiAiGenerate />}
              textTransform="uppercase"
              isLoading={isFetching}
            >
              generate
            </Button>
          </HStack>
          <Input {...methods.register('topics')} hidden />
        </HStack>
        <TopicTagList mt={-2} maxW={590} />
      </FormProvider>
      <RandomSentenceList data={data} query={methods.getValues('topics')} />
    </Stack>
  );
}
