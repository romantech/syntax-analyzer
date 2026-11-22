import { Accordion, Heading, HStack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { type ConstituentWithoutId, SelectableTagButton } from '@/features/syntax-editor';
import { groupedConstituentsByType } from '@/features/syntax-editor/data';

interface TagListAccordionProps extends Accordion.RootProps {
  onTagSelect?: (tag: ConstituentWithoutId) => void;
}

export default function TagListAccordion({
  onTagSelect,
  ...accordionProps
}: TagListAccordionProps) {
  const { t } = useTranslation();
  const categories = [
    {
      id: 'general',
      label: t('editor.generalTags'),
      desc: t('editor.generalTagsHelp'),
      constituents: groupedConstituentsByType.token,
    },
    {
      id: 'phrase',
      label: t('editor.phraseTags'),
      desc: t('editor.phraseTagsHelp'),
      constituents: groupedConstituentsByType.phrase,
    },
    {
      id: 'clause',
      label: t('editor.clauseTags'),
      desc: t('editor.clauseTagsHelp'),
      constituents: groupedConstituentsByType.clause,
    },
  ];

  return (
    <Accordion.Root defaultValue={['general']} collapsible {...accordionProps}>
      {categories.map((category) => (
        <Accordion.Item key={category.id} value={category.id}>
          <Accordion.ItemTrigger minH={onTagSelect ? '44px' : undefined}>
            <HStack flex="1" textAlign="left" textTransform="uppercase" py={2} flexWrap="wrap">
              <Heading as="span" fontSize="xl" lineHeight={1.2}>
                {category.label}
              </Heading>
              <Text>{category.desc}</Text>
            </HStack>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Wrap gap={2}>
                {category.constituents.map((constituent) => (
                  <WrapItem key={constituent.label}>
                    <SelectableTagButton constituent={constituent} onSelect={onTagSelect} />
                  </WrapItem>
                ))}
              </Wrap>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
