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
import { TagButton } from './tag-list';

export default function TagList({ ...accordionProps }: AccordionProps) {
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

          <AccordionPanel display="flex" flexWrap="wrap" gap={2}>
            {category.constituents.map((constituent) => {
              return (
                <WrapItem key={constituent.label}>
                  <TagButton constituent={constituent} />
                </WrapItem>
              );
            })}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
