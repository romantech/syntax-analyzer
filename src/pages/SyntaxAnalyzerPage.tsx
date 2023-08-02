import { yupResolver } from '@hookform/resolvers/yup';
import { analyzeSentenceSchema } from '@/constants/scheme';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Badge,
  Box,
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  FormControl,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import SentenceInput from '@/components/sentence-manager/SentenceInput';
import React from 'react';
import { DevTool } from '@hookform/devtools';

export type Model = '3.5' | '4';
type AnalyzeSentenceFormValues = { model: Model; sentence: string };
const DEFAULT_VALUES: AnalyzeSentenceFormValues = {
  model: '3.5',
  sentence: '',
};

const AnalyzeSentenceForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnalyzeSentenceFormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(analyzeSentenceSchema),
  });

  const onSubmit: SubmitHandler<AnalyzeSentenceFormValues> = (data) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Stack spacing={10}>
        <HStack borderWidth={1} borderRadius="2xl" p={4}>
          <CircularProgress size="40px" value={40} color="green.400">
            <CircularProgressLabel fontSize={13}>4회</CircularProgressLabel>
          </CircularProgress>
          <Center height="40px" px={1}>
            <Divider orientation="vertical" />
          </Center>
          <Box>
            <Text fontWeight="bold">남은 분석 횟수 4/12회</Text>
            <Text>
              하루 최대 12회까지 분석할 수 있어요(Model 4는 1번에 3회씩 차감)
            </Text>
          </Box>
        </HStack>
        <Controller
          name="model"
          control={control}
          render={({ field: { onChange, value } }) => (
            <RadioGroup onChange={onChange} value={value} w="full">
              <Heading size="lg" mb={4}>
                AI 모델 선택
              </Heading>
              <VStack align="start">
                <HStack align="center">
                  <Radio value="4">
                    <Text as="span">Model 4</Text>
                  </Radio>
                  <Badge fontSize={10} variant="outline" colorScheme="green">
                    recommended
                  </Badge>
                </HStack>
                <Text ml={6} fontSize={14} color="gray.500" mt={-1}>
                  분석 속도는 느린 편이지만 정확도는 높아요
                </Text>
                <Radio value="3.5">
                  <Text as="span">Model 3.5</Text>
                </Radio>
                <Text ml={6} fontSize={14} color="gray.500" mt={-1}>
                  분석 속도는 빠르지만 정확도는 낮은 편이에요
                </Text>
              </VStack>
            </RadioGroup>
          )}
        />
        <FormControl isInvalid={!!errors.sentence}>
          <Heading size="lg" mb={4}>
            영어 문장 입력
          </Heading>
          <HStack align="start">
            <SentenceInput
              {...register('sentence')}
              errorMessage={errors.sentence?.message}
            />
            <Button type="submit" isLoading={isSubmitting}>
              분석
            </Button>
          </HStack>
        </FormControl>
      </Stack>
      <DevTool control={control} />
    </form>
  );
};

export default function SyntaxAnalyzerPage() {
  return (
    <VStack maxW="container.md" mt={5}>
      <AnalyzeSentenceForm />
    </VStack>
  );
}
