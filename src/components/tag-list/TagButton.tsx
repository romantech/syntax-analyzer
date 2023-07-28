import { Button, Tooltip } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai/index';
import {
  selectedTagActionAtom,
  tagInfoModeAtom,
} from '@/store/controlPanelStore';
import { ConstituentWithoutId } from '@/types/analysis.ts';
import { ConstituentTranslations } from '@/constants/constituents.ts';

interface TagButtonProps {
  constituent: ConstituentWithoutId;
}

export default function TagButton({ constituent }: TagButtonProps) {
  const isTagInfoMode = useAtomValue(tagInfoModeAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagActionAtom);

  const onTagClick = (tag: ConstituentWithoutId) => {
    if (selectedTag?.elementId === tag.elementId) {
      setSelectedTag(null);
      return;
    }
    setSelectedTag(tag);
  };

  const { ko, desc } = ConstituentTranslations[constituent.label];
  const isSelected = selectedTag?.elementId === constituent.elementId;
  return (
    <Tooltip label={desc} isDisabled={!isTagInfoMode} openDelay={200}>
      <Button
        textTransform="capitalize"
        size="sm"
        onClick={() => onTagClick(constituent)}
        colorScheme={isSelected ? 'blue' : 'gray'}
      >
        {ko}
      </Button>
    </Tooltip>
  );
}
