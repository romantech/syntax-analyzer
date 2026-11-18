import { Button, Tooltip } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';

import {
  CONSTITUENT_TRANSLATIONS,
  type ConstituentWithoutId,
  selectedTagActionAtom,
  tagInfoModeAtom,
} from '@/features/syntax-editor';

interface TagButtonProps {
  constituent: ConstituentWithoutId;
}

export default function SelectableTagButton({ constituent }: TagButtonProps) {
  const [isInfoOpen, setInfoOpen] = useState(false);
  const isTagInfoMode = useAtomValue(tagInfoModeAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagActionAtom);

  const onTagClick = (tag: ConstituentWithoutId) => {
    if (selectedTag?.elementId === tag.elementId) {
      setSelectedTag(null);
      return;
    }
    setSelectedTag(tag);
  };

  const { ko, desc } = CONSTITUENT_TRANSLATIONS[constituent.label];
  const isSelected = selectedTag?.elementId === constituent.elementId;
  return (
    <Tooltip label={desc} isOpen={isTagInfoMode && isInfoOpen}>
      <Button
        size="sm"
        minH={{ base: '44px', lg: 8 }}
        aria-pressed={isSelected}
        onMouseEnter={() => setInfoOpen(true)}
        onMouseLeave={() => setInfoOpen(false)}
        onFocus={() => setInfoOpen(true)}
        onBlur={() => setInfoOpen(false)}
        onClick={() => {
          onTagClick(constituent);
          setInfoOpen(true);
        }}
        colorScheme={isSelected ? 'teal' : 'gray'}
      >
        {ko}
      </Button>
    </Tooltip>
  );
}
