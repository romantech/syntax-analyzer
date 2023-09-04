import { Text, TextProps } from '@chakra-ui/react';

import { getFormattedKoDate } from '@/base/utils/date';

interface DateChipProps extends TextProps {
  date: string;
}

export default function DateChip({ date, ...textProps }: DateChipProps) {
  return (
    <Text as="span" fontSize="xs" color="description" {...textProps}>
      {getFormattedKoDate(date)}
    </Text>
  );
}
