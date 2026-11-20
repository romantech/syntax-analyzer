import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  Portal,
  Spacer,
} from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { BsGithub } from 'react-icons/bs';
import { FiCoffee, FiMoreHorizontal } from 'react-icons/fi';
import { MdModeNight, MdOutlineLightMode } from 'react-icons/md';
import { NavLink, useLocation } from 'react-router';

import { useColorModeValue } from '@/base/hooks';
import { SITE_URLS } from '@/routes/paths';

const NAV_LINKS = [
  { label: 'Home', path: SITE_URLS.ROOT },
  { label: 'Analyzer', path: SITE_URLS.ANALYZER.ROOT },
  { label: 'Editor', path: SITE_URLS.EDITOR.ROOT },
] as const;

const EXTERNAL_LINKS = [
  {
    label: 'Buy me a coffee',
    href: 'https://www.buymeacoffee.com/colorfilter',
    icon: FiCoffee,
  },
  {
    label: 'GitHub repository',
    href: 'https://github.com/romantech/syntax-analyzer',
    icon: BsGithub,
  },
] as const;

export function Header() {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();

  const ToggleIcon = theme === 'light' ? MdModeNight : MdOutlineLightMode;

  const bg = useColorModeValue(
    { base: 'white', lg: 'whiteAlpha.800' },
    { base: 'gray.800', lg: 'grayAlpha.800' },
  );
  const boxShadow = useColorModeValue('sm', 'lg');
  const hoverColor = useColorModeValue('gray.400', 'gray.100');

  return (
    <Box
      as="nav"
      aria-label="Main navigation"
      position={{ base: 'sticky', lg: pathname === SITE_URLS.ROOT ? 'fixed' : 'sticky' }}
      w="full"
      top={0}
      p={{ base: 2, lg: 4 }}
      pt={{
        base: 'calc(var(--chakra-spacing-2) + env(safe-area-inset-top, 0px))',
        lg: 'calc(var(--chakra-spacing-4) + env(safe-area-inset-top, 0px))',
      }}
      zIndex={10}
      backdropFilter="blur(10px)"
      bg={bg}
      boxShadow={boxShadow}
    >
      <HStack maxW="8xl" mx="auto" gap={{ base: 0, sm: 2 }}>
        <HStack gap={{ base: 1, sm: 2 }}>
          {NAV_LINKS.map(({ label, path }) => (
            <Flex
              asChild
              key={path}
              align="center"
              transitionProperty="background-color, color"
              transitionDuration="0.3s"
              color="description"
              px={{ base: 0, lg: 4 }}
              py={{ base: 0, lg: 2 }}
              minH={{ base: '44px', lg: 10 }}
              borderRadius="xl"
              fontWeight="semibold"
              fontSize={{ base: '0.9375rem', lg: 'md' }}
              lineHeight={{ base: '1.25rem', lg: 'base' }}
              _hover={{ color: hoverColor }}
              _currentPage={{
                color: 'gray.800',
                bg: { lg: 'gray.100' },
                _hover: { color: 'gray.800' },
                '& > span': { bg: { base: 'gray.100', lg: 'transparent' } },
              }}
            >
              <NavLink to={path} end={path === SITE_URLS.ROOT}>
                <Box
                  as="span"
                  display="flex"
                  alignItems="center"
                  h={{ base: 10, lg: 'auto' }}
                  px={{ base: 2.5, sm: 4, lg: 0 }}
                  borderRadius="xl"
                >
                  {label}
                </Box>
              </NavLink>
            </Flex>
          ))}
        </HStack>
        <Spacer />
        <Flex align="center" gap={{ base: 1, lg: 0 }}>
          <Flex display={{ base: 'none', sm: 'flex' }}>
            {EXTERNAL_LINKS.map(({ label, href, icon }) => (
              <Button key={href} asChild variant="ghost">
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon as={icon} boxSize="1.2rem" />
                </a>
              </Button>
            ))}
          </Flex>
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="ghost"
            aria-label="Toggle color mode"
            minW={{ base: '44px', lg: 10 }}
            minH={{ base: '44px', lg: 10 }}
            px={{ base: 0, sm: 4 }}
          >
            <Icon as={ToggleIcon} boxSize="1.2rem" />
          </Button>
          <Menu.Root positioning={{ placement: 'bottom-end' }} lazyMount>
            <Menu.Trigger asChild>
              <IconButton
                display={{ base: 'inline-flex', sm: 'none' }}
                aria-label="More links"
                variant="ghost"
                boxSize="44px"
              >
                <FiMoreHorizontal />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content
                  _focusVisible={{
                    '& [data-highlighted]': {
                      outline: '2px solid',
                      outlineColor: 'focusRing',
                      outlineOffset: '-2px',
                    },
                  }}
                >
                  {EXTERNAL_LINKS.map(({ label, href, icon: LinkIcon }) => (
                    <Menu.Item key={href} value={href} asChild minH="44px">
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        <LinkIcon />
                        {label}
                      </a>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </HStack>
    </Box>
  );
}
