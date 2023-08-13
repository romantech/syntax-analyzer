import {
  Button,
  Center,
  Divider,
  Heading,
  Highlight,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  StackDivider,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  UnorderedList,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';
import { CiShoppingTag } from 'react-icons/ci';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { randomSentenceFormSchema } from '@/features/syntax-analyzer/schemes';
import { yupResolver } from '@hookform/resolvers/yup';
import { DevTool } from '@hookform/devtools';

type RandomSentenceFormValues = {
  sent_count: number;
  topics: string[];
};

const useRandomSentenceForm = () => {
  const useFormResults = useForm<RandomSentenceFormValues>({
    /** yup 스키마의 기본값 설정
     * @see https://github.com/orgs/react-hook-form/discussions/1936
     * */
    defaultValues: randomSentenceFormSchema.cast({}),
    resolver: yupResolver(randomSentenceFormSchema),
  });

  return { ...useFormResults };
};

export default function RandomSentenceForm() {
  const { handleSubmit, register, control } = useRandomSentenceForm();

  const onSubmit: SubmitHandler<RandomSentenceFormValues> = (data) => {
    console.log(data);
  };

  return (
    <Stack w="full" maxW={690} gap={5}>
      <Heading size="lg" textTransform="uppercase" pb={1}>
        랜덤 문장 생성
      </Heading>
      <UnorderedList>
        <ListItem>입력한 키워드와 관련된 랜덤 문장을 생성할 수 있어요</ListItem>
        <ListItem>1회 최대 5개의 랜덤 문장을 생성할 수 있어요</ListItem>
        <ListItem>키워드는 3개까지 추가할 수 있어요</ListItem>
      </UnorderedList>

      <HStack as="form" onSubmit={handleSubmit(onSubmit)}>
        <DevTool control={control} />
        <HStack>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <CiShoppingTag fontSize={18} />
            </InputLeftElement>
            <Input
              {...register('topics')}
              variant="filled"
              maxLength={20}
              focusBorderColor="teal.400"
              placeholder="영문 키워드를 입력 해주세요"
            />
          </InputGroup>
          <Button minW="fit-content" variant="outline">
            토픽 추가
          </Button>
        </HStack>
        <Center h="38px" px={3}>
          <Divider orientation="vertical" />
        </Center>
        <HStack>
          <Controller
            name="sent_count"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                focusBorderColor="teal.400"
                maxW={70}
                min={1}
                max={5}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <Button
            leftIcon={<RiAiGenerate />}
            textTransform="uppercase"
            type="submit"
          >
            generate
          </Button>
        </HStack>
      </HStack>
      <Wrap mt={-2} maxW="sm">
        {['spotlight', 'library', 'exam'].map((label, i) => (
          <Tag
            size="sm"
            key={i}
            borderRadius="md"
            variant="solid"
            colorScheme="teal"
          >
            <TagLabel w="fit" textTransform="capitalize">
              {label}
            </TagLabel>
            <TagCloseButton />
          </Tag>
        ))}
      </Wrap>

      <VStack
        align="stretch"
        maxH="190px"
        overflowY="auto"
        divider={<StackDivider borderColor="gray.700" />}
      >
        <Text as="i" cursor="pointer">
          <Highlight
            query={['spotlight', 'emphasize', 'Accentuate']}
            styles={{ color: 'teal.400', fontWeight: 'bold' }}
          >
            With the Highlight component, you can spotlight, emphasize and
            accentuate words.
          </Highlight>
        </Text>

        <Text as="i" cursor="pointer">
          <Highlight
            query={['library', 'exam']}
            styles={{ color: 'teal.400', fontWeight: 'bold' }}
          >
            Tom and Jerry are studying at the library for their final exam.
          </Highlight>
        </Text>
      </VStack>
    </Stack>
  );
}
