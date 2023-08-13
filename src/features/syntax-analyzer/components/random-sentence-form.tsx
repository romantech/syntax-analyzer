import {
  Button,
  Center,
  Divider,
  FormControl,
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
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
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
import {
  addTopicSchema,
  randomSentenceFormSchema,
} from '@/features/syntax-analyzer/schemes';
import { yupResolver } from '@hookform/resolvers/yup';
import { ValidationError } from 'yup';
import { useRef } from 'react';
import { RandomSentenceFormValues } from '@/features/syntax-analyzer/types';

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
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    getValues,
    resetField,
    watch,
    control,
    formState: { errors },
  } = useRandomSentenceForm();

  const topics = watch('topics');

  const onSubmit: SubmitHandler<RandomSentenceFormValues> = (data) => {
    console.log(data);
  };

  const onAddTopic = async () => {
    const keyword = getValues('keyword');

    try {
      await addTopicSchema.validate({ keyword, topics: [...topics, keyword] });
      setValue('topics', [...topics, keyword]);
      resetField('keyword');
    } catch (err) {
      if (err instanceof ValidationError) {
        setError('keyword', { type: 'manual', message: err.errors[0] });
      }
    }
  };

  const onTagClick = (keyword: string) => {
    setValue(
      'topics',
      topics.filter((topic) => topic !== keyword),
    );
  };

  /**
   * By default, Popover focus is to sent to PopoverContent when it opens.
   * Pass the keywordInputRef prop to send focus to a specific element instead.
   * @see https://react-hook-form.com/faqs
   * @see https://chakra-ui.com/docs/components/popover/usage
   * */
  const keywordInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: keywordRef, ...keywordRest } = register('keyword');

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
        <Stack>
          <FormControl isInvalid={!!errors.keyword}>
            <HStack>
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
                      {...keywordRest}
                      variant="filled"
                      ref={(element) => {
                        // Popover 표시될 때 focus 유지하기 위해 ref share
                        keywordRef(element);
                        keywordInputRef.current = element;
                      }}
                      maxLength={20}
                      focusBorderColor="teal.400"
                      placeholder="영문 키워드를 입력 해주세요"
                    />
                  </InputGroup>
                </PopoverAnchor>
                <PopoverContent w="fit-content">
                  <PopoverArrow />
                  <PopoverBody>{errors.keyword?.message}</PopoverBody>
                </PopoverContent>
              </Popover>
              <Button minW="fit-content" variant="outline" onClick={onAddTopic}>
                토픽 추가
              </Button>
            </HStack>
          </FormControl>
        </Stack>
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
            type="submit"
            leftIcon={<RiAiGenerate />}
            textTransform="uppercase"
          >
            generate
          </Button>
        </HStack>
        <Input {...register('topics')} hidden />
      </HStack>
      <Wrap mt={-2} maxW="sm">
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
