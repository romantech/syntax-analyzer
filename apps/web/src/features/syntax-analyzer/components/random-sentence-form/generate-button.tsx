import { Button, type ButtonProps, Icon, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RiAiGenerate } from 'react-icons/ri';

import {
  DAILY_SENTENCE_LIMIT,
  SENTENCE_CONTROL_HEIGHT,
  UsageLimitMessage,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';

export default function GenerateButton(buttonProps: ButtonProps) {
  const { data: count = 0 } = useRemainingCountQuery({
    select: (data) => data.random_sentence,
  });
  const hasCount = count > 0;

  return (
    <Stack align="start" w="min-content" maxW="full">
      <GenerateButtonControl count={count} disabled={!hasCount} {...buttonProps} />
      {!hasCount && <UsageLimitMessage />}
    </Stack>
  );
}

const GenerateButtonControl = ({ count, ...buttonProps }: ButtonProps & { count: number }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="outline"
      colorPalette="teal"
      borderColor="currentColor"
      size="lg"
      px={{ smDown: 5 }}
      w="max-content"
      maxW="full"
      gap={0}
      h={SENTENCE_CONTROL_HEIGHT}
      fontSize="md"
      textTransform="uppercase"
      {...buttonProps}
    >
      <Icon as={RiAiGenerate} me={2} />
      <Text as="span">{t('generator.generate')}</Text>
      <Text
        as="span"
        pl={1}
        display="grid"
        justifyItems="center"
        fontSize="sm"
        fontVariantNumeric="tabular-nums"
      >
        <Text as="span" gridArea="1 / 1" visibility="hidden">
          {`(${DAILY_SENTENCE_LIMIT} / ${DAILY_SENTENCE_LIMIT})`}
        </Text>
        <Text as="span" gridArea="1 / 1">
          {`(${count} / ${DAILY_SENTENCE_LIMIT})`}
        </Text>
      </Text>
    </Button>
  );
};

const GenerateButtonSkeleton = () => (
  <Skeleton asChild>
    <GenerateButtonControl count={DAILY_SENTENCE_LIMIT} aria-hidden inert />
  </Skeleton>
);

GenerateButton.Skeleton = GenerateButtonSkeleton;
