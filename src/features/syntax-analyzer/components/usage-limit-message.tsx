import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function UsageLimitMessage() {
  const { t } = useTranslation();
  return (
    <Text color="fg.muted" fontSize="sm">
      {t('analyzer.exhausted')}
    </Text>
  );
}
