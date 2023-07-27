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
import {
  selectedTagActionAtom,
  tagInfoModeAtom,
} from '@/store/controlPanelStore';
import { ConstituentWithoutId } from '@/types/analysis';

export default function TagList({ ...accordionProps }: AccordionProps) {
  const isTagInfoMode = useAtomValue(tagInfoModeAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagActionAtom);
  const onTagClick = (tag: ConstituentWithoutId) => {
    if (selectedTag?.elementId === tag.elementId) {
      setSelectedTag(null);
      return;
    }
    setSelectedTag(tag);
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
              const isSelected =
                selectedTag?.elementId === constituent.elementId;
              return (
                <WrapItem key={constituent.label}>
                  <Tooltip
                    label={desc}
                    isDisabled={!isTagInfoMode}
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
