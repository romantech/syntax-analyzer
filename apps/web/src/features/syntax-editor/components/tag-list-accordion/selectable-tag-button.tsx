import { Button } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/base';
import {
  type ConstituentWithoutId,
  selectedTagActionAtom,
  tagInfoModeAtom,
} from '@/features/syntax-editor';
import { getConstituentTranslation } from '../../helpers/constituent-translation';

interface TagButtonProps {
  constituent: ConstituentWithoutId;
  onSelect?: (tag: ConstituentWithoutId) => void;
}

export default function SelectableTagButton({ constituent, onSelect }: TagButtonProps) {
  const { t } = useTranslation();
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

  const { name, description } = getConstituentTranslation(t, constituent);
  const isSelected = selectedTag?.elementId === constituent.elementId;
  return (
    <Tooltip label={description} open={isTagInfoMode && isInfoOpen}>
      <Button
        size="sm"
        minH={onSelect ? '44px' : { base: '44px', lg: 8 }}
        aria-pressed={isSelected}
        onMouseEnter={() => setInfoOpen(true)}
        onMouseLeave={() => setInfoOpen(false)}
        onFocus={() => setInfoOpen(true)}
        onBlur={() => setInfoOpen(false)}
        onClick={() => {
          if (onSelect) {
            onSelect(constituent);
            return;
          }
          onTagClick(constituent);
          setInfoOpen(true);
        }}
        variant={isSelected ? 'outline' : 'subtle'}
        colorPalette={isSelected ? 'teal' : 'gray'}
        css={
          onSelect && !isSelected ? { '--subtle-button-bg': 'colors.bg.overlayButton' } : undefined
        }
      >
        {name}
      </Button>
    </Tooltip>
  );
}
