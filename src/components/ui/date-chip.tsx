import { Text, TextProps } from '@chakra-ui/react';
import { getFormattedKoDate } from '@/utils/dates';

interface DateChipProps extends TextProps {
  date: string;
}

export default function DateChip({ date, ...textProps }: DateChipProps) {
  return (
    <Text as="span" fontSize="xs" color="gray.500" {...textProps}>
      {getFormattedKoDate(date)}
    </Text>
  );
}
