import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { analyzeSentenceSchema } from '@/constants/scheme';
import {
  Badge,
  Button,
  FormControl,
  HStack,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AnalysisFormValues } from '@/types/analysis';
import { ConfirmModal, SentenceInput } from '@/components';
import FieldWithHeading from './FieldWithHeading';
import { useCreateAnalysisMutation, useRemainingCountQuery } from '@/queries';
import { expandAbbreviations, tokenizer } from '@/utils/string';
import { useAtom, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
  currentAnalysisAtom,
  userAnalysisListAtom,
} from '@/store/analysisStore';
import { getSyntaxTaggingPath } from '@/constants/siteUrls';
import { REMAINING_COUNT_BASE_KEY } from '@/queries/useRemainingCountQuery';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { GiMagicLamp } from 'react-icons/gi';

const getDefaultValue = (count: number): AnalysisFormValues => ({
  sentence: '',
  model: count > 2 ? 'gpt-4' : 'gpt-3.5-turbo',
});

const MODEL_RADIO_FIELDS = [
  {
    value: 'gpt-4',
    label: 'Model 4',
    desc: '분석 속도는 느리지만 정확도는 높아요',
    count: 3,
    recommend: true,
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'Model 3.5',
    desc: '분석 속도는 빠르지만 정확도는 낮아요',
    count: 1,
    recommend: false,
  },
];

export default function AnalysisForm({ ...stackProps }: StackProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: count = 0 } = useRemainingCountQuery({
    select: ({ count }) => count,
    suspense: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AnalysisFormValues>({
    defaultValues: getDefaultValue(count),
    resolver: yupResolver(analyzeSentenceSchema),
  });

  const { mutate, isLoading } = useCreateAnalysisMutation({
    onMutate: () => onClose(),
    onSuccess: (analysis) => {
      const addIdAnalysis = {
        ...analysis,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      };
      setUserAnalysisList([addIdAnalysis, ...userAnalysisList]);
      setCurrentAnalysis(addIdAnalysis);
      queryClient.invalidateQueries(REMAINING_COUNT_BASE_KEY);
      navigate(getSyntaxTaggingPath('user', 0));
    },
  });

  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);
  const [userAnalysisList, setUserAnalysisList] = useAtom(userAnalysisListAtom);

  const onConfirm = () => {
    const { model, sentence } = getValues();
    const tokenized = tokenizer(expandAbbreviations(sentence));
    const payload = { model, sentence: tokenized };
    mutate(payload);
  };

  return (
    <Stack as="form" onSubmit={handleSubmit(onOpen)} gap={10} {...stackProps}>
      <Controller
        name="model"
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup onChange={onChange} value={value}>
            <FieldWithHeading headingText="ai 모델 선택">
              {MODEL_RADIO_FIELDS.map((field) => (
                <Stack key={field.value}>
                  <HStack align="center">
                    <Radio value={field.value} isDisabled={count < field.count}>
                      {field.label}
                    </Radio>
                    <Badge
                      fontSize={10}
                      variant="outline"
                      colorScheme="green"
                      hidden={!field.recommend}
                    >
                      recommended
                    </Badge>
                  </HStack>
                  <Text ml={6} fontSize={14} color="gray.500" mt={-1}>
                    {field.desc}
                  </Text>
                </Stack>
              ))}
            </FieldWithHeading>
          </RadioGroup>
        )}
      />
      <FormControl isInvalid={!!errors.sentence}>
        <FieldWithHeading headingText="영어 문장 입력">
          <HStack align="start">
            <SentenceInput
              {...register('sentence')}
              errorMessage={errors.sentence?.message}
              isDisabled={isLoading}
            />
            <Button
              type="submit"
              isDisabled={!count}
              size="lg"
              leftIcon={<GiMagicLamp fontSize="24px" />}
              loadingText="분석중"
            >
              분석
            </Button>
          </HStack>
        </FieldWithHeading>
      </FormControl>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        headerContent="문장 분석 요청"
        bodyContent="입력한 영어 문장을 분석하시겠습니까?"
      />
    </Stack>
  );
}

const AnalysisFormSkeleton = () => {
  return (
    <Stack gap={10}>
      <Stack gap={5} mb={2}>
        <Skeleton w="full" maxW={180} h={10} borderRadius="md" mb={1} />
        <Stack>
          <Skeleton w="full" maxW={280} h={10} borderRadius="md" />
          <Skeleton w="full" maxW={280} h={10} borderRadius="md" />
        </Stack>
      </Stack>
      <Stack gap={5}>
        <Skeleton w="full" maxW={180} h={10} borderRadius="md" mb={1} />
        <HStack>
          <Skeleton w="full" h={10} borderRadius="md" />
          <Skeleton w="full" maxW={110} h={10} borderRadius="md" />
        </HStack>
      </Stack>
    </Stack>
  );
};

AnalysisForm.Skeleton = AnalysisFormSkeleton;
