import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type AccordionProps,
  Heading,
  HStack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import {
  type ConstituentWithoutId,
  SelectableTagButton,
  TAG_LIST_DEFAULT_INDEX,
} from '@/features/syntax-editor';
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

interface TagListAccordionProps extends AccordionProps {
  onTagSelect?: (tag: ConstituentWithoutId) => void;
}

export default function TagListAccordion({
  onTagSelect,
  ...accordionProps
}: TagListAccordionProps) {
  return (
    <Accordion defaultIndex={TAG_LIST_DEFAULT_INDEX} allowToggle {...accordionProps}>
      {CONSTITUENT_CATEGORIES.map((category) => (
        <AccordionItem key={category.label}>
          <AccordionButton minH={onTagSelect ? '44px' : undefined}>
            <HStack flex="1" textAlign="left" textTransform="uppercase" py={2} flexWrap="wrap">
              <Heading as="h2" size="md">
                {category.label}
              </Heading>
              <Text>{category.desc}</Text>
            </HStack>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel>
            <Wrap spacing={2}>
              {category.constituents.map((constituent) => (
                <WrapItem key={constituent.label}>
                  <SelectableTagButton constituent={constituent} onSelect={onTagSelect} />
                </WrapItem>
              ))}
            </Wrap>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
