import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Stack,
  WrapItem,
} from '@chakra-ui/react';
import {
  CONSTITUENT_CATEGORIES,
  ConstituentTranslations,
} from '@/constants/constituents.ts';

export default function TagList() {
  return (
    <Stack>
      <Accordion defaultIndex={[0]} allowMultiple>
        {CONSTITUENT_CATEGORIES.map((category) => (
          <AccordionItem key={category.label}>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                textTransform="uppercase"
              >
                {category.label}
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel display="flex" flexWrap="wrap" gap={2}>
              {category.constituents.map((constituent) => (
                <WrapItem key={constituent.label}>
                  <Button textTransform="capitalize" size="sm">
                    {ConstituentTranslations[constituent.label] ??
                      constituent.label}
                  </Button>
                </WrapItem>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
}
