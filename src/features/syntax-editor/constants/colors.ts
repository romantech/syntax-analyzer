import { ColorMode } from '@/base';
import { ConstituentColors } from '@/features/syntax-editor';

export const DELETE_MODE_HOVER_COLOR_SCHEME = (mode: ColorMode) => {
  return mode === 'dark'
    ? 'var(--chakra-colors-gray-500)'
    : 'var(--chakra-colors-gray-300)';
};

export const CONSTITUENT_COLORS: ConstituentColors = {
  token: {
    dark: 'red.200',
    light: 'red.400',
  },
  'token-group': {
    dark: 'blue.200',
    light: 'blue.400',
  },
  phrase: {
    dark: 'purple.200',
    light: 'purple.400',
  },
  clause: {
    dark: 'teal.200',
    light: 'teal.400',
  },
};
