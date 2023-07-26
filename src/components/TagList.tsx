import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  WrapItem,
} from '@chakra-ui/react';
import {
  CONSTITUENT_CATEGORIES,
  ConstituentTranslations,
} from '@/constants/constituents.ts';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function TagList() {
  return (
    <Stack>
      <Card variant="filled">
        <CardBody>
          <HStack>
            <Icon as={FaMagnifyingGlass} />
            <Text>태그를 선택한 후 문장을 드래그해주세요</Text>
          </HStack>
        </CardBody>
      </Card>
      <Accordion defaultIndex={[0]} allowToggle>
        {CONSTITUENT_CATEGORIES.map((category) => (
          <AccordionItem key={category.label}>
            <AccordionButton>
              <HStack
                flex="1"
                textAlign="left"
                textTransform="uppercase"
                py={2}
              >
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
                    <Tooltip label={desc}>
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
    </Stack>
  );
}
