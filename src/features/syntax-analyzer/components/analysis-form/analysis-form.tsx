import {
  Box,
  Button,
  FormControl,
  HStack,
  Skeleton,
  SkeletonProps,
  Stack,
  type StackProps,
} from '@chakra-ui/react';
import {
  FieldGroupHeader,
  ModelChoiceGroup,
  useAnalysisForm,
} from '@/features/syntax-analyzer';
import { ConfirmModal } from '@/base';
import { GiMagicLamp } from 'react-icons/gi';
import { SentenceInput } from '@/features/syntax-editor';
import { PropsWithChildren } from 'react';

export default function AnalysisForm({ ...stackProps }: StackProps) {
  const {
    control,
    register,
    remainingCount,
    isLoading,
    onSubmit,
    isModalOpen,
    onSubmitConfirm,
    closeModal,
    formState: { errors },
  } = useAnalysisForm();

  return (
    <AnalysisFormBox as="form" onSubmit={onSubmit} {...stackProps}>
      <Box>
        <FieldGroupHeader>ai 모델 선택</FieldGroupHeader>
        <ModelChoiceGroup control={control} remainingCount={remainingCount} />
      </Box>
      <FormControl isInvalid={!!errors.sentence}>
        <FieldGroupHeader>영어 문장 입력</FieldGroupHeader>
        <HStack align="start">
          <SentenceInput
            {...register('sentence')}
            errorMessage={errors.sentence?.message}
            isDisabled={isLoading}
            showHelperText
          />
          <Button
            type="submit"
            isDisabled={!remainingCount}
            size="lg"
            leftIcon={<GiMagicLamp fontSize="24px" />}
            loadingText="분석중"
          >
            분석
          </Button>
        </HStack>
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

const AnalysisFormBox = ({
  children,
  ...stackProps
}: PropsWithChildren<StackProps>) => {
  return (
    <Stack w="full" maxW={690} gap={10} {...stackProps}>
      {children}
    </Stack>
  );
};

const AnalysisFormSkeleton = (stackProps: StackProps) => {
  const ESkeleton = (props: SkeletonProps) => (
    <Skeleton w="full" borderRadius="md" h={10} {...props} />
  );

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
