import { Box, Button, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronsDown } from 'react-icons/lu';
import { useLabelWidth } from './use-label-width';

const collapsedBackground = { base: 'teal.50', _dark: '#101e1c' };
const expandedBackground = { base: 'teal.100', _dark: 'teal.800' };

interface AllTagsButtonProps {
  expanded: boolean;
  sentenceId: string;
  disabled: boolean;
  isTapMode: boolean;
  onClick: () => void;
}

export default function AllTagsButton({
  expanded,
  sentenceId,
  disabled,
  isTapMode,
  onClick,
}: AllTagsButtonProps) {
  const { t } = useTranslation();
  const { labelRef, width } = useLabelWidth();

  return (
    <Button
      size="sm"
      minH={isTapMode ? 11 : 9}
      variant="outline"
      colorPalette="teal"
      bg={collapsedBackground}
      color={{ base: 'teal.700', _dark: '#80ecd9' }}
      borderColor={{ base: 'teal.600', _dark: '#52bbad' }}
      _hover={{ bg: expandedBackground }}
      _expanded={{
        bg: expandedBackground,
        color: { _dark: 'teal.200' },
        _hover: { bg: collapsedBackground },
      }}
      aria-expanded={expanded}
      aria-controls={sentenceId}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon
        as={LuChevronsDown}
        aria-hidden
        transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
        transition="transform 160ms ease-out"
        _motionReduce={{ transition: 'none' }}
      />
      <Box
        as="span"
        display="inline-flex"
        overflow="hidden"
        flexShrink={0}
        style={{ width }}
        transition="width 160ms ease-out"
        _motionReduce={{ transition: 'none' }}
      >
        <Box as="span" ref={labelRef} flexShrink={0}>
          {expanded ? t('editor.collapseAllTags') : t('editor.expandAllTags')}
        </Box>
      </Box>
    </Button>
  );
}
