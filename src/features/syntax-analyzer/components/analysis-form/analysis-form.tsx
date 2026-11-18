import {
  Box,
  Button,
  FormControl,
  HStack,
  Skeleton,
  type SkeletonProps,
  Stack,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';
import { useWatch } from 'react-hook-form';
import { GiMagicLamp } from 'react-icons/gi';

import { ConfirmModal } from '@/base';
import {
  ANALYSIS_DECREMENT_COUNT,
  AnalysisModel,
  FieldGroupHeader,
  ModelChoiceGroup,
  SentenceInput,
  UsageLimitMessage,
  useAnalysisForm,
} from '@/features/syntax-analyzer';

export default function AnalysisForm({ ...stackProps }: StackProps) {
  const {
    control,
    register,
    remainingCount,
    isPending,
    onSubmit,
    isModalOpen,
    onSubmitConfirm,
    closeModal,
    formState: { errors },
  } = useAnalysisForm();
  const model = useWatch({ control, name: 'model' });
  const canAnalyze = remainingCount >= ANALYSIS_DECREMENT_COUNT[model];

  return (
    <AnalysisFormBox as="form" onSubmit={onSubmit} {...stackProps}>
      <Box>
        <FieldGroupHeader>ai 모델 선택</FieldGroupHeader>
        <ModelChoiceGroup control={control} remainingCount={remainingCount} />
        {remainingCount > 0 && remainingCount < ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY] && (
          <Text mt={2} color="description" fontSize="sm">
            고급 모델은 분석 횟수가 {ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY]}회 필요해요.
          </Text>
        )}
      </Box>
      <FormControl isInvalid={!!errors.sentence}>
        <FieldGroupHeader>영어 문장 입력</FieldGroupHeader>
        <Stack direction={{ base: 'column', sm: 'row' }} align={{ base: 'stretch', sm: 'start' }}>
          <SentenceInput
            {...register('sentence')}
            errorMessage={errors.sentence?.message}
            isDisabled={isPending}
            showHelperText
          />
          <Button
            type="submit"
            isDisabled={!canAnalyze || isPending}
            flexShrink={0}
            alignSelf={{ base: 'end', sm: 'start' }}
            size="lg"
            leftIcon={<GiMagicLamp fontSize="24px" />}
          >
            분석
          </Button>
        </Stack>
        {remainingCount === 0 && <UsageLimitMessage />}
      </FormControl>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={onSubmitConfirm}
        headerContent="문장 분석 요청"
        bodyContent="입력한 영어 문장을 분석하시겠습니까?"
      />
    </AnalysisFormBox>
  );
}

const AnalysisFormBox = ({ children, ...stackProps }: PropsWithChildren<StackProps>) => {
  return (
    <Stack w="full" maxW={660} gap={{ base: 8, lg: 10 }} {...stackProps}>
      {children}
    </Stack>
  );
};

const ESkeleton = (props: SkeletonProps) => (
  <Skeleton w="full" borderRadius="md" h={10} {...props} />
);

const AnalysisFormSkeleton = (stackProps: StackProps) => {
  return (
    <AnalysisFormBox {...stackProps}>
      <Stack gap={5} mb={2}>
        <ESkeleton maxW={180} mb={1} />
        <Stack>
          <ESkeleton maxW={280} />
          <ESkeleton maxW={280} />
        </Stack>
      </Stack>
      <Stack gap={5}>
        <ESkeleton maxW={180} mb={1} />
        <HStack>
          <ESkeleton />
          <ESkeleton maxW={110} />
        </HStack>
        <ESkeleton maxW={250} h="85px" />
      </Stack>
    </AnalysisFormBox>
  );
};

AnalysisForm.Skeleton = AnalysisFormSkeleton;
