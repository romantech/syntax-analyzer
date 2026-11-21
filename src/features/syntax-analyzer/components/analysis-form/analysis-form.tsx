import {
  Box,
  Button,
  type ButtonProps,
  Field,
  Icon,
  List,
  Skeleton,
  Stack,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';
import { useWatch } from 'react-hook-form';
import { BsMagic } from 'react-icons/bs';
import { GiMagicLamp } from 'react-icons/gi';
import { PiNotePencil } from 'react-icons/pi';
import { RiEnglishInput } from 'react-icons/ri';
import { TbArrowAutofitWidth } from 'react-icons/tb';

import { ConfirmModal } from '@/base';
import {
  ANALYSIS_DECREMENT_COUNT,
  AnalysisModel,
  FieldGroupHeader,
  ModelChoiceGroup,
  SENTENCE_CONTROL_HEIGHT,
  SentenceInput,
  UsageLimitMessage,
  useAnalysisForm,
} from '@/features/syntax-analyzer';
import { HELPER_MESSAGES } from '@/features/syntax-analyzer/schemes';

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
          <Text mt={2} color="fg.muted" fontSize="sm">
            고급 모델은 분석 횟수가 {ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY]}회 필요해요.
          </Text>
        )}
      </Box>
      <Field.Root invalid={!!errors.sentence} gap={0}>
        <FieldGroupHeader>영어 문장 입력</FieldGroupHeader>
        <SentenceInputRow>
          <SentenceInput
            {...register('sentence')}
            errorMessage={errors.sentence?.message}
            disabled={isPending}
          />
          <AnalysisButton disabled={!canAnalyze || isPending} />
        </SentenceInputRow>
        {remainingCount === 0 && <UsageLimitMessage />}
        <SentenceInputHelp />
      </Field.Root>
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
    <Stack w="full" maxW={660} gap={{ base: 12, lg: 10 }} {...stackProps}>
      {children}
    </Stack>
  );
};

const SentenceInputRow = ({ children }: PropsWithChildren) => (
  <Stack
    w="full"
    direction={{ base: 'column', sm: 'row' }}
    align={{ base: 'stretch', sm: 'start' }}
    gap={3}
  >
    {children}
  </Stack>
);

const AnalysisButton = (props: ButtonProps) => (
  <Button
    type="submit"
    variant="outline"
    colorPalette="teal"
    borderColor="currentColor"
    flexShrink={0}
    alignSelf="start"
    size="lg"
    h={SENTENCE_CONTROL_HEIGHT}
    fontSize="md"
    {...props}
  >
    <Icon as={GiMagicLamp} boxSize={5} />
    분석
  </Button>
);

const SentenceInputHelp = () => (
  <Field.HelperText color="fg.muted" mt={4} asChild>
    <List.Root variant="plain" alignSelf="stretch" fontSize="sm" gap={1.5}>
      {HELPER_TEXTS.map(({ icon, text }) => (
        <List.Item key={text}>
          <List.Indicator asChild>
            <Icon as={icon} aria-hidden />
          </List.Indicator>
          {text}
        </List.Item>
      ))}
    </List.Root>
  </Field.HelperText>
);

const AnalysisFormSkeleton = (stackProps: StackProps) => {
  return (
    <AnalysisFormBox {...stackProps}>
      <Box>
        <FieldGroupHeader>ai 모델 선택</FieldGroupHeader>
        <Stack>
          <Skeleton aria-hidden maxW={192} h="49px" borderRadius="md" />
          <Skeleton aria-hidden maxW={156} h="49px" borderRadius="md" />
        </Stack>
      </Box>
      <Field.Root gap={0}>
        <FieldGroupHeader>영어 문장 입력</FieldGroupHeader>
        <SentenceInputRow>
          <Skeleton aria-hidden flexGrow={1} h={SENTENCE_CONTROL_HEIGHT} borderRadius="md" />
          <Skeleton asChild>
            <AnalysisButton aria-hidden inert />
          </Skeleton>
        </SentenceInputRow>
        <SentenceInputHelp />
      </Field.Root>
    </AnalysisFormBox>
  );
};

AnalysisForm.Skeleton = AnalysisFormSkeleton;

const HELPER_TEXTS = [
  {
    icon: BsMagic,
    text: `축약 표현은 자동으로 풀어져요 (I'll → I will)`,
  },
  {
    icon: RiEnglishInput,
    text: HELPER_MESSAGES.ENGLISH_OR_SYMBOL,
  },
  {
    icon: TbArrowAutofitWidth,
    text: HELPER_MESSAGES.MAX_LENGTH,
  },
  {
    icon: PiNotePencil,
    text: HELPER_MESSAGES.MIN_WORDS,
  },
];
