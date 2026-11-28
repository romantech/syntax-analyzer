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
} from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { BsMagic } from 'react-icons/bs';
import { GiMagicLamp } from 'react-icons/gi';
import { PiNotePencil } from 'react-icons/pi';
import { RiEnglishInput } from 'react-icons/ri';
import { TbArrowAutofitWidth } from 'react-icons/tb';

import { ConfirmModal } from '@/base';
import {
  FieldGroupHeader,
  MAX_SENTENCE_LENGTH,
  MIN_SENTENCE_WORDS,
  SENTENCE_CONTROL_HEIGHT,
  SentenceInput,
  UsageLimitMessage,
  useAnalysisForm,
} from '@/features/syntax-analyzer';

export default function AnalysisForm({ ...stackProps }: StackProps) {
  const { t } = useTranslation();
  const {
    register,
    remainingCount,
    isPending,
    onSubmit,
    isModalOpen,
    onSubmitConfirm,
    closeModal,
    formState: { errors },
  } = useAnalysisForm();
  const canAnalyze = remainingCount > 0;

  return (
    <AnalysisFormBox as="form" onSubmit={onSubmit} {...stackProps}>
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
        {remainingCount === 0 && (
          <Box mt={{ smDown: 2 }}>
            <UsageLimitMessage />
          </Box>
        )}
        <SentenceInputHelp />
      </Field.Root>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={onSubmitConfirm}
        confirmLabel={t('analyzer.analyze')}
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
      px={{ smDown: 5 }}
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
