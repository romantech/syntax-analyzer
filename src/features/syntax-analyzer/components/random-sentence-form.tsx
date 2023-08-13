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
  ListProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Stack,
  StackDivider,
  StackProps,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  UnorderedList,
  VStack,
  Wrap,
  WrapProps,
} from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';
import { CiShoppingTag } from 'react-icons/ci';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { addTopicSchema } from '@/features/syntax-analyzer/schemes';
import { ValidationError } from 'yup';
import { useRef } from 'react';
import { RandomSentenceFormValues } from '@/features/syntax-analyzer/types';
import { DevTool } from '@hookform/devtools';
import { useRandomSentenceForm } from '@/features/syntax-analyzer';

export default function RandomSentenceForm() {
  const { methods, generateRandomSentences, isFetching, data } =
    useRandomSentenceForm();
  const { getValues, register, control } = methods;

  return (
    <Stack w="full" maxW={690} gap={5}>
      <Heading size="lg" textTransform="uppercase" pb={1}>
        랜덤 문장 생성
      </Heading>
      <RandomSentenceInstructions />
      <FormProvider {...methods}>
        <DevTool control={control} />
        <HStack>
          <AddTopicForm />
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
              onClick={generateRandomSentences}
              leftIcon={<RiAiGenerate />}
              textTransform="uppercase"
              isLoading={isFetching}
            >
              generate
            </Button>
          </HStack>
          <Input {...register('topics')} hidden />
        </HStack>
        <TopicList mt={-2} maxW="sm" />
      </FormProvider>
      <RandomSentences data={data} query={getValues('topics')} />
    </Stack>
  );
}

const RandomSentenceInstructions = (listProps: ListProps) => {
  return (
    <UnorderedList {...listProps}>
      <ListItem>입력한 키워드와 관련된 랜덤 문장을 생성할 수 있어요</ListItem>
      <ListItem>키워드는 3개까지 추가할 수 있어요 (선택)</ListItem>
      <ListItem>1회 최대 5개의 랜덤 문장을 생성할 수 있어요</ListItem>
    </UnorderedList>
  );
};

interface RandomSentencesProps {
  data?: string[];
  query: string[];
}
const RandomSentences = ({ data, query }: RandomSentencesProps) => {
  return (
    <VStack
      align="stretch"
      maxH="190px"
      overflowY="auto"
      divider={<StackDivider borderColor="gray.700" />}
    >
      {data?.map((sentence) => (
        <Text as="i" cursor="pointer" key={sentence}>
          <Highlight
            query={query}
            styles={{ color: 'teal.400', fontWeight: 'bold' }}
          >
            {sentence}
          </Highlight>
        </Text>
      ))}
    </VStack>
  );
};

const TopicList = (wrapProps: WrapProps) => {
  const { control, setValue } = useFormContext<RandomSentenceFormValues>();
  const topics = useWatch({ name: 'topics', control });

  const onTagClick = (keyword: string) => {
    const filteredTopics = topics.filter((topic) => topic !== keyword);
    setValue('topics', filteredTopics);
  };

  return (
    <Wrap {...wrapProps}>
      {topics.map((topic) => (
        <Tag
          size="sm"
          key={topic}
          borderRadius="md"
          variant="solid"
          colorScheme="teal"
        >
          <TagLabel w="fit" textTransform="uppercase">
            {topic}
          </TagLabel>
          <TagCloseButton onClick={() => onTagClick(topic)} />
        </Tag>
      ))}
    </Wrap>
  );
};

const AddTopicForm = (stackProps: StackProps) => {
  const {
    register,
    clearErrors,
    handleSubmit,
    setValue,
    resetField,
    setError,
    formState,
  } = useFormContext<RandomSentenceFormValues>();
  /**
   * By default, Popover focus is to sent to PopoverContent when it opens.
   * Pass the keywordInputRef prop to send focus to a specific element instead.
   * @see https://react-hook-form.com/faqs
   * @see https://chakra-ui.com/docs/components/popover/usage
   * */
  const keywordInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: registerRef, onChange, ...registerRest } = register('keyword');

  const onAddTopic: SubmitHandler<RandomSentenceFormValues> = (data) => {
    const { keyword, topics } = data;

    addTopicSchema
      .validate({ keyword, topics: [...topics, keyword] })
      .then(() => {
        setValue('topics', [...topics, keyword]);
        resetField('keyword');
      })
      .catch((err: ValidationError) => {
        setError('keyword', { type: 'manual', message: err.errors[0] });
      });
  };

  const { errors } = formState;

  return (
    <HStack as="form" onSubmit={handleSubmit(onAddTopic)} {...stackProps}>
      <Popover
        isOpen={!!errors.keyword}
        placement="top"
        initialFocusRef={keywordInputRef}
      >
        <PopoverAnchor>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <CiShoppingTag fontSize={18} />
            </InputLeftElement>
            <Input
              {...registerRest}
              onChange={(v) => {
                onChange(v);
                if (errors.keyword) clearErrors('keyword');
              }}
              variant="filled"
              ref={(element) => {
                // Popover 표시될 때 focus 유지하기 위해 ref share
                registerRef(element);
                keywordInputRef.current = element;
              }}
              maxLength={20}
              focusBorderColor="teal.400"
              placeholder="영문 키워드를 입력 해주세요"
              onBlur={() => clearErrors('keyword')}
            />
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent w="fit-content">
          <PopoverArrow />
          <PopoverBody>{errors.keyword?.message}</PopoverBody>
        </PopoverContent>
      </Popover>
      <Button minW="fit-content" variant="outline" type="submit">
        토픽 추가
      </Button>
    </HStack>
  );
};
