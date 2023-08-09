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
  WrapItem,
} from '@chakra-ui/react';
import {
  SelectableTagButton,
  TAG_LIST_DEFAULT_INDEX,
} from '@/features/syntax-editor';
import { groupedConstituentsByType } from '@/features/syntax-editor/data';

const CONSTITUENT_CATEGORIES = [
  {
    label: 'general',
    desc: '주어/동사 등 태그',
    constituents: groupedConstituentsByType.token,
  },
  {
    label: 'phrase',
    desc: '전치사구/동명사구 등 태그',
    constituents: groupedConstituentsByType.phrase,
  },
  {
    label: 'clause',
    desc: '독립절/의존절 등 태그',
    constituents: groupedConstituentsByType.clause,
  },
];

export default function TagListAccordion({
  ...accordionProps
}: AccordionProps) {
  return (
    <Accordion
      defaultIndex={TAG_LIST_DEFAULT_INDEX}
      allowToggle
      {...accordionProps}
    >
      {CONSTITUENT_CATEGORIES.map((category) => (
        <AccordionItem key={category.label}>
          <AccordionButton>
            <HStack flex="1" textAlign="left" textTransform="uppercase" py={2}>
              <Heading as="h2" size="md">
                {category.label}
              </Heading>
              <Text>{category.desc}</Text>
            </HStack>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel
            display="flex"
            flexWrap="wrap"
            gap={2}
            maxW="container.lg"
          >
            {category.constituents.map((constituent) => (
              <WrapItem key={constituent.label}>
                <SelectableTagButton constituent={constituent} />
              </WrapItem>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
