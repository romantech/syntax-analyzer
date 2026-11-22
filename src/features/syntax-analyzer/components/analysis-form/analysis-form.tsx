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
import { useTranslation } from 'react-i18next';
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
  MAX_SENTENCE_LENGTH,
  MIN_SENTENCE_WORDS,
  ModelChoiceGroup,
  SENTENCE_CONTROL_HEIGHT,
  SentenceInput,
  UsageLimitMessage,
  useAnalysisForm,
} from '@/features/syntax-analyzer';

export default function AnalysisForm({ ...stackProps }: StackProps) {
  const { t } = useTranslation();
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
        <FieldGroupHeader>{t('analyzer.chooseModel')}</FieldGroupHeader>
        <ModelChoiceGroup control={control} remainingCount={remainingCount} />
        {remainingCount > 0 && remainingCount < ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY] && (
          <Text mt={2} color="fg.muted" fontSize="sm">
            {t('analyzer.modelCost', { cost: ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY] })}
          </Text>
        )}
      </Box>
      <Field.Root invalid={!!errors.sentence} gap={0}>
        <FieldGroupHeader>{t('analyzer.enterSentence')}</FieldGroupHeader>
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
        headerContent={t('analyzer.confirmTitle')}
        bodyContent={t('analyzer.confirmBody')}
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

const AnalysisButton = (props: ButtonProps) => {
  const { t } = useTranslation();
  return (
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
      {t('analyzer.analyze')}
    </Button>
  );
};

const SentenceInputHelp = () => {
  const { t } = useTranslation();
  const helperTexts = [
    { icon: BsMagic, text: t('analyzer.contractions') },
    { icon: RiEnglishInput, text: t('validation.englishOnly') },
    {
      icon: TbArrowAutofitWidth,
      text: t('validation.sentenceMax', { limit: MAX_SENTENCE_LENGTH }),
    },
    { icon: PiNotePencil, text: t('validation.sentenceMin', { limit: MIN_SENTENCE_WORDS }) },
  ];
  return (
    <Field.HelperText color="fg.muted" mt={4} asChild>
      <List.Root variant="plain" alignSelf="stretch" fontSize="sm" gap={1.5}>
        {helperTexts.map(({ icon, text }) => (
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
};

const AnalysisFormSkeleton = (stackProps: StackProps) => {
  const { t } = useTranslation();
  return (
    <AnalysisFormBox {...stackProps}>
      <Box>
        <FieldGroupHeader>{t('analyzer.chooseModel')}</FieldGroupHeader>
        <Stack>
          <Skeleton aria-hidden maxW={192} h="49px" borderRadius="md" />
          <Skeleton aria-hidden maxW={156} h="49px" borderRadius="md" />
        </Stack>
      </Box>
      <Field.Root gap={0}>
        <FieldGroupHeader>{t('analyzer.enterSentence')}</FieldGroupHeader>
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
