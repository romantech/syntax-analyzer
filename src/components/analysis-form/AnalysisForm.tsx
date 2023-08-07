import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { analyzeSentenceSchema } from '@/constants/scheme';
import {
  Badge,
  Button,
  ButtonProps,
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
import { useRemainingCount } from '@/hooks';
import { Suspense } from 'react';
import { useCreateAnalysisMutation } from '@/queries';
import { expandAbbreviations, tokenizer } from '@/utils/string';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { fingerprintAtom } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import {
  currentAnalysisAtom,
  userAnalysisListAtom,
} from '@/store/analysisStore';
import { getSyntaxTaggingPath } from '@/constants/siteUrls';
import { REMAINING_COUNT_BASE_KEY } from '@/queries/useRemainingCountQuery';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';

const DEFAULT_VALUES: AnalysisFormValues = {
  model: 'gpt-3.5-turbo',
  sentence: '',
};

const SubmitButton = ({ ...buttonProps }: ButtonProps) => {
  const { data: count } = useRemainingCount();

  return (
    <Button type="submit" isDisabled={!count} {...buttonProps}>
      분석
    </Button>
  );
};

export default function AnalysisForm({ ...stackProps }: StackProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AnalysisFormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(analyzeSentenceSchema),
  });

  const { mutate, isLoading } = useCreateAnalysisMutation({
    onMutate: () => onClose(),
    onSuccess: (analysis) => {
      const addIdAnalysis = { ...analysis, id: nanoid() };
      setUserAnalysisList([addIdAnalysis, ...userAnalysisList]);
      setCurrentAnalysis(addIdAnalysis);
      queryClient.invalidateQueries(REMAINING_COUNT_BASE_KEY);
      navigate(getSyntaxTaggingPath('user', 0));
    },
  });

  const fingerprint = useAtomValue(fingerprintAtom);
  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);
  const [userAnalysisList, setUserAnalysisList] = useAtom(userAnalysisListAtom);

  const onConfirm = () => {
    const { model, sentence } = getValues();
    const tokenized = tokenizer(expandAbbreviations(sentence));
    const payload = { model, sentence: tokenized, fingerprint };
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
              <Stack>
                <HStack align="center">
                  <Radio value="gpt-4">Model 4</Radio>
                  <Badge fontSize={10} variant="outline" colorScheme="green">
                    recommended
                  </Badge>
                </HStack>
                <Text ml={6} fontSize={14} color="gray.500" mt={-1}>
                  분석 속도는 느리지만 정확도는 높아요
                </Text>
              </Stack>
              <Stack>
                <Radio value="gpt-3.5-turbo">Model 3.5</Radio>
                <Text ml={6} fontSize={14} color="gray.500" mt={-1}>
                  분석 속도는 빠르지만 정확도는 낮아요
                </Text>
              </Stack>
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
            <Suspense fallback={<Skeleton w="60px" h={10} borderRadius="md" />}>
              <SubmitButton />
            </Suspense>
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
