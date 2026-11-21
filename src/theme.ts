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
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _dark: '{colors.gray.950}' } },
          panel: { value: { _dark: '{colors.gray.900}' } },
          subtle: { value: { _dark: '{colors.gray.900}' } },
          muted: { value: { _dark: '{colors.gray.800}' } },
        },
        teal: {
          accent: { value: { _light: '{colors.teal.600}', _dark: '{colors.teal.300}' } },
          focusRing: { value: '{colors.gray.focusRing}' },
          fg: {
            value: { _light: 'color-mix(in srgb, {colors.teal.600} 38%, {colors.teal.700})' },
          },
        },
      },
    },
    textStyles: {
      button: { value: { lineHeight: 1.2 } },
      showcaseGradient: {
        value: {
          '--showcase-end':
            'color-mix(in srgb, var(--chakra-colors-green-600) 30%, var(--chakra-colors-yellow-600))',
          bgImage:
            'linear-gradient(to right, var(--chakra-colors-teal-accent), var(--showcase-end) var(--showcase-stop, 70%))',
          bgClip: 'text',
          color: 'transparent',
          _light: {
            bgImage:
              'linear-gradient(to right, var(--chakra-colors-teal-accent), var(--chakra-colors-green-600) calc(var(--showcase-stop, 70%) / 2), var(--showcase-end) var(--showcase-stop, 70%))',
          },
          _dark: { '--showcase-end': 'colors.yellow.400' },
        },
      },
    },
    recipes: {
      heading: defineRecipe({ base: { fontWeight: 'bold' } }),
      container: defineRecipe({ base: { px: 4 } }),
      button: defineRecipe({
        defaultVariants: { variant: 'surface' },
        base: {
          borderRadius: 'md',
          borderWidth: 0,
          fontWeight: 'semibold',
          '&[data-part="close-trigger"]:enabled': { cursor: 'pointer' },
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
            // Declare the inherited variant so defineRecipe can type-check the default.
            surface: {},
            ghost: { _hover: { bg: 'colorPalette.subtle' }, _active: { bg: 'colorPalette.muted' } },
            outline: {
              borderColor: 'colorPalette.border',
              _hover: { bg: 'colorPalette.subtle' },
              _active: { bg: 'colorPalette.muted' },
            },
            subtle: {
              _hover: { _disabled: { bg: 'colorPalette.subtle' } },
              _active: { bg: 'colorPalette.emphasized' },
              _dark: {
                bg: 'colorPalette.muted',
                _hover: {
                  bg: 'colorPalette.emphasized',
                  _disabled: { bg: 'colorPalette.muted' },
                },
              },
            },
            plain: { color: 'inherit', p: 0, minW: 0, h: 'auto' },
          },
        },
      }),
      input: defineRecipe({
        base: {
          borderRadius: 'md',
          _placeholder: { color: 'fg.muted', opacity: 1 },
        },
        variants: {
          size: { md: { fontSize: 'md', lineHeight: 'base', px: 4 } },
          variant: {
            outline: {
              _focus: {
                borderColor: 'var(--focus-color)',
                _invalid: { borderColor: 'var(--error-color)' },
              },
            },
          },
        },
      }),
      badge: defineRecipe({
        base: { borderRadius: '2px', fontWeight: 'semibold', textTransform: 'uppercase' },
        variants: { size: { sm: { minH: 0, px: 1, lineHeight: 'base' } } },
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
                fontSize: 'md',
                fontWeight: 'normal',
                lineHeight: 'base',
                '&[aria-selected=false]': { _hover: { color: 'fg' } },
                _selected: {
                  _horizontal: {
                    '--indicator-color': 'colors.teal.accent',
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
                borderColor: 'gray.500',
                _checked: {
                  bg: 'teal.accent',
                  borderColor: 'teal.accent',
                  _dark: { color: 'black' },
                },
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
                bg: 'gray.500',
                _checked: { bg: 'teal.accent' },
              },
              thumb: {
                boxSize: 4,
                scale: 1,
                boxShadow: 'none',
                _checked: { _dark: { bg: 'black' } },
              },
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
      outlineColor: 'colorPalette.focusRing',
      outlineOffset: '2px',
    },
    '*::-webkit-scrollbar': { width: '6px', height: '6px' },
    '*::-webkit-scrollbar-track': { background: 'transparent' },
    '*::-webkit-scrollbar-thumb': { backgroundColor: 'gray.500', borderRadius: 'full' },
    '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'fg.muted' },
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
