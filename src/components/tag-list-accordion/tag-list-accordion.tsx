import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Heading,
  HStack,
  Text,
  WrapItem,
} from '@chakra-ui/react';
import { CONSTITUENT_CATEGORIES } from '@/constants/constituents';
import SelectableTagButton from './selectable-tag-button';

export default function TagListAccordion({
  ...accordionProps
}: AccordionProps) {
  return (
    <Accordion allowToggle {...accordionProps}>
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
