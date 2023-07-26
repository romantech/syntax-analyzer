import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Button,
  Heading,
  HStack,
  Text,
  Tooltip,
  WrapItem,
} from '@chakra-ui/react';
import {
  CONSTITUENT_CATEGORIES,
  ConstituentTranslations,
} from '@/constants/constituents';
import { useAtomValue } from 'jotai';
import { tagTooltipModeAtom } from '@/store/controlPanelStore.ts';

export default function TagList({ ...accordionProps }: AccordionProps) {
  const tagTooltipMode = useAtomValue(tagTooltipModeAtom);

  return (
    <Accordion defaultIndex={[0]} allowToggle {...accordionProps}>
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
              const { ko, desc } = ConstituentTranslations[constituent.label];
              return (
                <WrapItem key={constituent.label}>
                  <Tooltip label={desc} isDisabled={!tagTooltipMode}>
                    <Button textTransform="capitalize" size="sm">
                      {ko}
                    </Button>
                  </Tooltip>
                </WrapItem>
              );
            })}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
