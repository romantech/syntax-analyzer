import { Box, Button, Icon } from '@chakra-ui/react';
import type { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronsDown } from 'react-icons/lu';
import { useLabelWidth } from './use-label-width';

interface AllTagsButtonProps {
  expanded: boolean;
  sentenceId: string;
  disabled: boolean;
  isTapMode: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
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
      css={{
        '--tag-toggle-background': { base: 'colors.teal.100', _dark: 'colors.teal.800' },
      }}
      bg="color-mix(in srgb, var(--tag-toggle-background) 25%, transparent)"
      color={{ base: 'teal.700', _dark: '#80ecd9' }}
      borderColor={{ base: 'teal.600', _dark: '#52bbad' }}
      _hover={{ bg: 'color-mix(in srgb, var(--tag-toggle-background) 60%, transparent)' }}
      _expanded={{
        bg: 'color-mix(in srgb, var(--tag-toggle-background) 75%, transparent)',
        color: { _dark: 'teal.200' },
        _hover: { bg: 'color-mix(in srgb, var(--tag-toggle-background) 100%, transparent)' },
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
