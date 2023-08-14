import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';
import { FormProvider } from 'react-hook-form';
import {
  AddTopicForm,
  RandomSentenceCount,
  RandomSentenceInstructions,
  RandomSentences,
  Topics,
  useRandomSentenceForm,
} from '@/features/syntax-analyzer';

export default function RandomSentenceForm() {
  const { methods, isFetching, data, generateSentences } =
    useRandomSentenceForm();

  return (
    <Stack w="full" maxW={690} gap={5}>
      <Heading size="lg" textTransform="uppercase" pb={1}>
        랜덤 문장 생성
      </Heading>
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
        <Topics mt={-2} maxW={590} />
      </FormProvider>
      <RandomSentences data={data} query={methods.getValues('topics')} />
    </Stack>
  );
}
