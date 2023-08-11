import { Controller } from 'react-hook-form';
import {
  Badge,
  Button,
  FormControl,
  HStack,
  Radio,
  RadioGroup,
  Skeleton,
  SkeletonProps,
  Stack,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import {
  FieldWithHeading,
  useCreateAnalysisForm,
} from '@/features/syntax-analyzer';
import { ConfirmModal } from '@/base';
import { GiMagicLamp } from 'react-icons/gi';
import { SentenceInput } from '@/features/syntax-editor';

const MODEL_RADIO_FIELDS = [
  {
    value: 'gpt-4',
    label: 'gpt-4',
    desc: '분석 속도는 느리지만 정확도는 높아요',
    count: 3,
    recommend: true,
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'gpt-3.5',
    desc: '분석 속도는 빠르지만 정확도는 낮아요',
    count: 1,
    recommend: false,
  },
];

export default function CreateAnalysisForm({ ...stackProps }: StackProps) {
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
  } = useCreateAnalysisForm();

  return (
    <Stack as="form" onSubmit={onSubmit} gap={10} {...stackProps}>
      <Controller
        name="model"
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup onChange={onChange} value={value}>
            <FieldWithHeading headingText="ai 모델 선택">
              {MODEL_RADIO_FIELDS.map((field) => (
                <Stack key={field.value}>
                  <HStack align="center">
                    <Radio
                      value={field.value}
                      isDisabled={remainingCount < field.count}
                    >
                      <Text as="span" textTransform="uppercase">
                        {field.label}
                      </Text>
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
              isDisabled={!remainingCount}
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
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={onSubmitConfirm}
        headerContent="문장 분석 요청"
        bodyContent="입력한 영어 문장을 분석하시겠습니까?"
      />
    </Stack>
  );
}

const AnalysisFormSkeleton = () => {
  const ESkeleton = (props: SkeletonProps) => (
    <Skeleton w="full" borderRadius="md" h={10} {...props} />
  );

  return (
    <Stack gap={10}>
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
      </Stack>
    </Stack>
  );
};

CreateAnalysisForm.Skeleton = AnalysisFormSkeleton;
