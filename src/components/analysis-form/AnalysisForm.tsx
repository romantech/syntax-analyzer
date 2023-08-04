import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { analyzeSentenceSchema } from '@/constants/scheme';
import {
  Badge,
  Button,
  FormControl,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { DevTool } from '@hookform/devtools';
import { AnalysisFormValues } from '@/types/analysis';
import { SentenceInput } from '@/components';
import FieldWithHeading from './FieldWithHeading';
import { useRemainingCount } from '@/hooks';

const DEFAULT_VALUES: AnalysisFormValues = {
  model: '4',
  sentence: '',
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
  const { data: count } = useRemainingCount();

  const onSubmit: SubmitHandler<AnalysisFormValues> = (data) => {};

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
                  <Radio value="4">Model 4</Radio>
                  <Badge fontSize={10} variant="outline" colorScheme="green">
                    recommended
                  </Badge>
                </HStack>
                <Text ml={6} fontSize={14} color="gray.500" mt={-1}>
                  분석 속도는 느리지만 정확도는 높아요
                </Text>
              </Stack>
              <Stack>
                <Radio value="3.5">Model 3.5</Radio>
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
            <Button type="submit" isLoading={isSubmitting} isDisabled={!count}>
              분석
            </Button>
          </HStack>
        </FieldWithHeading>
      </FormControl>
      <DevTool control={control} />
    </Stack>
  );
}
