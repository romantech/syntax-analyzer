import { List, type ListRootProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { MAX_TOPIC_ADDITION } from '@/features/syntax-analyzer';

export default function RandomSentenceInstructions(listProps: ListRootProps) {
  const { t } = useTranslation();
  const instructions = [
    t('generator.maxTopics', { limit: MAX_TOPIC_ADDITION }),
    t('generator.randomTopics'),
    t('generator.copyInstructions'),
  ];
  return (
    <List.Root ps={4} css={{ '& li::marker': { color: 'inherit' } }} {...listProps}>
      {instructions.map((instruction) => (
        <List.Item key={instruction}>{instruction}</List.Item>
      ))}
    </List.Root>
  );
}
