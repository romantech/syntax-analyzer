import { Accordion, Heading, HStack, Text, Wrap, WrapItem } from '@chakra-ui/react';

import { type ConstituentWithoutId, SelectableTagButton } from '@/features/syntax-editor';
import { groupedConstituentsByType } from '@/features/syntax-editor/data';

const CONSTITUENT_CATEGORIES = [
  {
    label: 'general',
    desc: '주어/동사/목적어 등',
    constituents: groupedConstituentsByType.token,
  },
  {
    label: 'phrase',
    desc: '전치사구/동명사구 등',
    constituents: groupedConstituentsByType.phrase,
  },
  {
    label: 'clause',
    desc: '독립절/종속절 등',
    constituents: groupedConstituentsByType.clause,
  },
];

interface TagListAccordionProps extends Accordion.RootProps {
  onTagSelect?: (tag: ConstituentWithoutId) => void;
}

export default function TagListAccordion({
  onTagSelect,
  ...accordionProps
}: TagListAccordionProps) {
  return (
    <Accordion.Root defaultValue={['general']} collapsible {...accordionProps}>
      {CONSTITUENT_CATEGORIES.map((category) => (
        <Accordion.Item key={category.label} value={category.label}>
          <Accordion.ItemTrigger minH={onTagSelect ? '44px' : undefined}>
            <HStack flex="1" textAlign="left" textTransform="uppercase" py={2} flexWrap="wrap">
              <Heading as="span" fontSize="xl">
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
