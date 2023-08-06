import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
  Spinner,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { DevTool } from '@hookform/devtools';
import { AnalysisFormValues } from '@/types/analysis';
import { SentenceInput } from '@/components';
import FieldWithHeading from './FieldWithHeading';
import { useRemainingCount } from '@/hooks';
import { Suspense } from 'react';
import { useCreateAnalysisMutation } from '@/queries';
import { expandAbbreviations, tokenizer } from '@/utils/string';
import { useAtomValue } from 'jotai';
import { fingerprintAtom } from '@/store/userStore';

const DEFAULT_VALUES: AnalysisFormValues = {
  model: 'gpt-3.5-turbo',
  sentence: '',
};

const SubmitButton = ({ ...buttonProps }: ButtonProps) => {
  const { data: count } = useRemainingCount();

  return (
    <Button type="submit" disabled={!count} {...buttonProps}>
      분석
    </Button>
  );
};

export default function AnalysisForm({ ...stackProps }: StackProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnalysisFormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(analyzeSentenceSchema),
  });

  const { mutate, isLoading } = useCreateAnalysisMutation();
  const fingerprint = useAtomValue(fingerprintAtom);

  const onSubmit: SubmitHandler<AnalysisFormValues> = ({ sentence, model }) => {
    const payload = {
      model,
      sentence: tokenizer(expandAbbreviations(sentence)),
      fingerprint,
    };
    mutate(payload, {
      onSuccess: (res) => {
        console.log(res);
      },
    });
  };

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)} gap={10} {...stackProps}>
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
            />
            <Suspense fallback={<Skeleton w="60px" h={10} borderRadius="md" />}>
              <SubmitButton isLoading={isSubmitting} />
            </Suspense>
          </HStack>
        </FieldWithHeading>
      </FormControl>
      <DevTool control={control} />
      {isLoading && <Spinner />}
    </Stack>
  );
}
