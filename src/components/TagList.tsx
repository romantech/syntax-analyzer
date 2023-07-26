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
import { useAtom, useAtomValue } from 'jotai';
import { tagInfoModeAtom } from '@/store/controlPanelStore';
import { ConstituentWithoutId } from '@/types/analysis';
import { selectedTagAtom } from '@/store/analysisStore';
import { generateNumberID } from '@/utils/common';

export default function TagList({ ...accordionProps }: AccordionProps) {
  const tagTooltipMode = useAtomValue(tagInfoModeAtom);
  const [tagList, setTagList] = useAtom(selectedTagAtom);
  const onTagClick = (tag: ConstituentWithoutId) => {
    if (tagList?.elementId === tag.elementId) {
      setTagList(null);
      return;
    }
    const constituentWithId = { ...tag, id: generateNumberID() };
    setTagList(constituentWithId);
  };

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
              const { ko, desc } = ConstituentTranslations[constituent.label];
              const isSelected = tagList?.elementId === constituent.elementId;
              return (
                <WrapItem key={constituent.label}>
                  <Tooltip
                    label={desc}
                    isDisabled={!tagTooltipMode}
                    openDelay={200}
                  >
                    <Button
                      textTransform="capitalize"
                      size="sm"
                      onClick={() => onTagClick(constituent)}
                      colorScheme={isSelected ? 'blue' : 'gray'}
                    >
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
