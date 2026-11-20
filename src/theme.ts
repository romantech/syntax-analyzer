import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from '@chakra-ui/react';
import {
  accordionAnatomy,
  cardAnatomy,
  radioGroupAnatomy,
  switchAnatomy,
  tabsAnatomy,
} from '@chakra-ui/react/anatomy';

const fontFamily =
  '"Pretendard Variable", system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

const config = defineConfig({
  // next-themes puts one explicit mode on <html>, the root of the semantic tokens.
  conditions: { light: '.light &, &.light', dark: '.dark &, &.dark' },
  theme: {
    breakpoints: { lg: '62em' },
    keyframes: {
      'skeleton-pulse': {
        from: { backgroundColor: 'var(--start-color)' },
        to: { backgroundColor: 'var(--end-color)' },
      },
    },
    tokens: {
      fonts: { body: { value: fontFamily }, heading: { value: fontFamily } },
      lineHeights: { base: { value: 1.5 } },
      colors: {
        gray: {
          50: { value: '#f7fafc' },
          100: { value: '#edf2f7' },
          200: { value: '#e2e8f0' },
          300: { value: '#cbd5e0' },
          400: { value: '#a0aec0' },
          500: { value: '#718096' },
          600: { value: '#4a5568' },
          700: { value: '#2d3748' },
          800: { value: '#1a202c' },
          900: { value: '#171923' },
        },
        whiteAlpha: {
          50: { value: 'rgba(255, 255, 255, 0.04)' },
          100: { value: 'rgba(255, 255, 255, 0.06)' },
          200: { value: 'rgba(255, 255, 255, 0.08)' },
          300: { value: 'rgba(255, 255, 255, 0.16)' },
          400: { value: 'rgba(255, 255, 255, 0.24)' },
          900: { value: 'rgba(255, 255, 255, 0.92)' },
        },
        grayAlpha: {
          50: { value: 'rgba(26, 32, 43, 0.04)' },
          100: { value: 'rgba(26, 32, 43, 0.06)' },
          200: { value: 'rgba(26, 32, 43, 0.08)' },
          300: { value: 'rgba(26, 32, 43, 0.16)' },
          400: { value: 'rgba(26, 32, 43, 0.24)' },
          500: { value: 'rgba(26, 32, 43, 0.36)' },
          600: { value: 'rgba(26, 32, 43, 0.48)' },
          700: { value: 'rgba(26, 32, 43, 0.64)' },
          800: { value: 'rgba(26, 32, 43, 0.80)' },
          900: { value: 'rgba(26, 32, 43, 0.92)' },
        },
        teal: {
          100: { value: '#b2f5ea' },
          200: { value: '#81e6d9' },
          300: { value: '#4fd1c5' },
          400: { value: '#38b2ac' },
          500: { value: '#319795' },
          600: { value: '#2c7a7b' },
          700: { value: '#285e61' },
          800: { value: '#234e52' },
        },
        yellow: { 400: { value: '#ecc94b' }, 800: { value: '#744210' } },
        green: { 200: { value: '#9ae6b4' }, 600: { value: '#2f855a' } },
        red: {
          200: { value: '#feb2b2' },
          300: { value: '#fc8181' },
          400: { value: '#f56565' },
          500: { value: '#e53e3e' },
          600: { value: '#c53030' },
        },
        blue: {
          200: { value: '#90cdf4' },
          400: { value: '#4299e1' },
        },
        purple: { 200: { value: '#d6bcfa' }, 400: { value: '#9f7aea' } },
      },
    },
    semanticTokens: {
      shadows: {
        sm: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
        lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
        'dark-lg': {
          value:
            '0 0 0 1px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.2), 0 15px 40px rgba(0, 0, 0, 0.4)',
        },
      },
      colors: {
        focusRing: {
          value: {
            _light: 'color-mix(in srgb, {colors.teal.600} 75%, {colors.teal.500})',
            _dark: 'color-mix(in srgb, {colors.teal.300} 75%, {colors.teal.200})',
          },
        },
        bg: {
          DEFAULT: { value: { _light: '{colors.white}', _dark: '{colors.gray.800}' } },
          panel: { value: { _light: '{colors.white}', _dark: '{colors.gray.700}' } },
          subtle: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.700}' } },
        },
        fg: {
          DEFAULT: { value: { _light: '{colors.gray.800}', _dark: '{colors.whiteAlpha.900}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.gray.200}', _dark: '{colors.whiteAlpha.300}' } },
          error: { value: { _light: '{colors.red.500}', _dark: '{colors.red.300}' } },
        },
        gray: {
          focusRing: { value: '{colors.focusRing}' },
          fg: { value: { _light: '{colors.gray.800}', _dark: '{colors.whiteAlpha.900}' } },
          subtle: { value: { _light: '{colors.gray.100}', _dark: '{colors.whiteAlpha.200}' } },
          muted: { value: { _light: '{colors.gray.200}', _dark: '{colors.whiteAlpha.300}' } },
          border: { value: { _light: '{colors.gray.200}', _dark: '{colors.whiteAlpha.300}' } },
        },
        teal: {
          focusRing: { value: '{colors.focusRing}' },
          solid: { value: { _light: '{colors.teal.500}', _dark: '{colors.teal.200}' } },
          contrast: { value: { _light: '{colors.white}', _dark: '{colors.gray.800}' } },
        },
        description: { value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' } },
      },
    },
    textStyles: { button: { value: { lineHeight: 1.2 } } },
    recipes: {
      heading: defineRecipe({ base: { fontWeight: 'bold' } }),
      container: defineRecipe({ base: { px: 4 } }),
      button: defineRecipe({
        base: {
          borderRadius: 'md',
          borderWidth: 0,
          fontWeight: 'semibold',
          _disabled: { opacity: 0.4 },
        },
        variants: {
          size: {
            xs: { h: 6, minW: 6, px: 2, fontSize: 'xs', textStyle: 'button' },
            sm: { h: 8, minW: 8, px: 3, fontSize: 'sm', textStyle: 'button' },
            md: { fontSize: 'md', textStyle: 'button' },
            lg: { h: 12, minW: 12, px: 6, fontSize: 'lg', gap: 2, textStyle: 'button' },
          },
          variant: {
            ghost: { _hover: { bg: 'colorPalette.subtle' }, _active: { bg: 'colorPalette.muted' } },
            outline: {
              borderColor: 'colorPalette.border',
              _hover: { bg: 'colorPalette.subtle' },
              _active: { bg: 'colorPalette.muted' },
            },
            subtle: {
              _hover: { _disabled: { bg: 'colorPalette.subtle' } },
              _active: { bg: 'colorPalette.emphasized' },
            },
            plain: { color: 'inherit', p: 0, minW: 0, h: 'auto' },
          },
        },
      }),
      input: defineRecipe({
        base: {
          borderRadius: 'md',
          _placeholder: { color: 'description', opacity: 1 },
        },
        variants: {
          size: { md: { fontSize: 'md', lineHeight: 'base', px: 4 } },
          variant: {
            subtle: {
              bg: 'gray.100',
              borderWidth: 2,
              focusVisibleRing: 'none',
              _hover: { bg: 'gray.200' },
              _focus: {
                bg: 'transparent',
                borderColor: 'var(--focus-color)',
                _invalid: { borderColor: 'var(--error-color)' },
              },
              _invalid: { borderColor: 'var(--error-color)' },
              _dark: {
                bg: 'whiteAlpha.50',
                _hover: { bg: 'whiteAlpha.100' },
                _focus: { bg: 'transparent' },
              },
            },
          },
        },
      }),
      badge: defineRecipe({
        base: { borderRadius: '2px', fontWeight: 'semibold', textTransform: 'uppercase' },
        variants: {
          size: { sm: { minH: 0, px: 1, lineHeight: 'base' } },
          variant: {
            subtle: {
              bg: 'colorPalette.100',
              color: 'colorPalette.800',
              _dark: { bg: 'colorPalette.200/16', color: 'colorPalette.200' },
            },
          },
        },
      }),
      skeleton: defineRecipe({
        compoundVariants: [
          {
            loading: true,
            variant: 'pulse',
            css: {
              '--start-color': 'colors.gray.100',
              '--end-color': 'colors.gray.400',
              bg: 'gray.200',
              opacity: 0.7,
              animation: 'skeleton-pulse linear infinite alternate',
              animationDuration: '0.8s',
              _dark: {
                '--start-color': 'colors.gray.800',
                '--end-color': 'colors.gray.600',
                bg: 'gray.700',
              },
              _motionReduce: { animation: 'none' },
            },
          },
        ],
      }),
      separator: defineRecipe({ base: { opacity: 0.6 } }),
    },
    slotRecipes: {
      card: defineSlotRecipe({
        slots: cardAnatomy.keys(),
        base: { root: { borderRadius: 'md' } },
        variants: {
          variant: { outline: { root: { bg: 'bg' } }, subtle: { root: { bg: 'bg.subtle' } } },
        },
      }),
      accordion: defineSlotRecipe({
        slots: accordionAnatomy.keys(),
        base: {
          itemTrigger: {
            cursor: 'pointer',
            px: 4,
            borderRadius: 0,
            fontWeight: 'normal',
            _hover: { bg: 'blackAlpha.50', _dark: { bg: 'whiteAlpha.50' } },
          },
          itemBody: { px: 4, pt: 2, pb: 5 },
          itemIndicator: { color: 'inherit' },
        },
        variants: {
          variant: {
            outline: {
              item: { borderTopWidth: 1, borderBottomWidth: 0, _last: { borderBottomWidth: 1 } },
            },
          },
        },
      }),
      tabs: defineSlotRecipe({
        slots: tabsAnatomy.keys(),
        variants: {
          variant: {
            line: {
              list: { _horizontal: { borderBottomWidth: 2 } },
              trigger: {
                color: 'inherit',
                fontSize: 'md',
                fontWeight: 'normal',
                lineHeight: 'base',
                _selected: {
                  color: 'teal.600',
                  _dark: { color: 'teal.300' },
                  _horizontal: {
                    '--indicator-color': 'currentColor',
                    '--indicator-offset-y': '-2px',
                  },
                },
              },
            },
          },
        },
      }),
      radioGroup: defineSlotRecipe({
        slots: radioGroupAnatomy.keys(),
        base: {
          item: { cursor: 'pointer' },
          itemControl: { cursor: 'inherit' },
          itemText: { fontSize: 'md', fontWeight: 'normal', lineHeight: 'base' },
        },
        variants: {
          size: { md: { item: { gap: 2 }, itemControl: { boxSize: 4 } } },
          variant: {
            solid: {
              itemControl: {
                borderWidth: 2,
                borderColor: 'border',
                _checked: { color: 'white', _dark: { color: 'gray.900' } },
                '& .dot': { scale: 0.5 },
              },
            },
          },
        },
      }),
      switch: defineSlotRecipe({
        slots: switchAnatomy.keys(),
        variants: {
          size: { md: { root: { '--switch-width': '34px' } } },
          variant: {
            solid: {
              control: {
                p: 0.5,
                bg: 'gray.300',
                _dark: { bg: 'whiteAlpha.400', _checked: { bg: 'colorPalette.solid' } },
              },
              thumb: { boxSize: 4, scale: 1, boxShadow: 'none', _checked: { bg: 'white' } },
            },
          },
        },
      }),
    },
  },
  globalCss: {
    html: { color: 'fg', bg: 'bg' },
    body: {
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
    },
    ':where(a[href], button, [tabindex]):focus-visible': {
      outline: '2px solid',
      outlineColor: 'focusRing',
      outlineOffset: '2px',
    },
    '*::-webkit-scrollbar': { width: '6px', height: '6px' },
    '*::-webkit-scrollbar-track': { background: 'transparent' },
    '*::-webkit-scrollbar-thumb': { backgroundColor: 'gray.500', borderRadius: 'full' },
    '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'description' },
    '*': {
      fontFeatureSettings: 'normal',
      '@supports not selector(::-webkit-scrollbar)': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--chakra-colors-gray-500) transparent',
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
