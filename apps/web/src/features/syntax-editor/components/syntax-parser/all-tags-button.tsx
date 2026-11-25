import { Box, Button } from '@chakra-ui/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronsDown, LuChevronsUp } from 'react-icons/lu';

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
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState<number>();

  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) return;

    const measure = () => setLabelWidth(label.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    return () => observer.disconnect();
  }, []);

  return (
    <Button
      size="sm"
      minH={isTapMode ? 11 : 9}
      variant="outline"
      colorPalette="teal"
      bg={{ base: 'teal.50', _dark: '#101e1c' }}
      color={{ base: 'teal.700', _dark: '#80ecd9' }}
      borderColor={{ base: 'teal.600', _dark: '#52bbad' }}
      _hover={{ bg: { base: 'teal.100', _dark: 'teal.800' } }}
      _expanded={{
        bg: { base: 'teal.100', _dark: 'teal.800' },
        color: { _dark: 'teal.200' },
        _hover: { bg: { base: 'teal.200', _dark: 'teal.700' } },
      }}
      aria-expanded={expanded}
      aria-controls={sentenceId}
      disabled={disabled}
      onClick={onClick}
    >
      {expanded ? <LuChevronsUp aria-hidden /> : <LuChevronsDown aria-hidden />}
      <Box
        as="span"
        display="inline-flex"
        overflow="hidden"
        flexShrink={0}
        style={{ width: labelWidth }}
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
