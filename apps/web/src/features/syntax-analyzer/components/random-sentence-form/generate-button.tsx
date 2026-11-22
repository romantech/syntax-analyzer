import { Button, type ButtonProps, Icon, Skeleton, Stack, Text } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
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
      w="max-content"
      minW={170}
      maxW="full"
      gap={0}
      h="auto"
      minH={SENTENCE_CONTROL_HEIGHT}
      py={1}
      fontSize="md"
      textTransform="uppercase"
      css={{ '&:lang(en)': { smDown: { px: 2, fontSize: 'sm' } } }}
      {...buttonProps}
    >
      <Icon as={RiAiGenerate} me={2} />
      <Text as="span" whiteSpace="normal">
        <Trans
          t={t}
          i18nKey="generator.generate"
          components={{ wide: <Text as="span" hideBelow="sm" /> }}
        />
      </Text>
      <Text pl={1} as="span" fontSize="sm" fontVariantNumeric="tabular-nums">
        (
        <Text as="span" display="inline-block" w="2ch" textAlign="end">
          {count}
        </Text>
        {`/${DAILY_SENTENCE_LIMIT})`}
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
