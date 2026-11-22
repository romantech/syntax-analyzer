import { Text, type TextProps } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

import { getFormattedDate } from '@/base/utils/date';
import { getActiveLanguage } from '@/i18n';

interface DateChipProps extends TextProps {
  date: string;
}

export default function DateChip({ date, ...textProps }: DateChipProps) {
  const { i18n } = useTranslation();
  return (
    <Text as="span" fontSize="xs" color="fg.muted" {...textProps}>
      {getFormattedDate(date, getActiveLanguage(i18n))}
    </Text>
  );
}
