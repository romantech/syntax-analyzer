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
  Tabs,
} from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { BsGithub } from 'react-icons/bs';
import { FiCoffee, FiMoreHorizontal } from 'react-icons/fi';
import { MdModeNight, MdOutlineLightMode } from 'react-icons/md';
import { matchPath, NavLink, useLocation, useNavigate } from 'react-router';

import { useColorModeValue } from '@/base/hooks';
import { SITE_URLS } from '@/routes/paths';

const NAV_TABS = [
  {
    label: 'home',
    path: '/',
    matchPath: '/',
  },
  {
    label: 'analyzer',
    path: SITE_URLS.ANALYZER.ROOT,
    matchPath: `${SITE_URLS.ANALYZER.ROOT}/*`,
  },
  {
    label: 'editor',
    path: SITE_URLS.EDITOR.ROOT,
    matchPath: `${SITE_URLS.EDITOR.ROOT}/*`,
  },
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
  const activePath = NAV_TABS.find((tab) => matchPath(tab.matchPath, pathname))?.path ?? null;
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const ToggleIcon = theme === 'light' ? MdModeNight : MdOutlineLightMode;

  const bg = useColorModeValue(
    { base: 'white', lg: 'whiteAlpha.800' },
    { base: 'gray.800', lg: 'grayAlpha.800' },
  );
  const boxShadow = useColorModeValue('sm', 'lg');
  const hoverColor = useColorModeValue('gray.400', 'gray.100');
  const focusRingColor = useColorModeValue('teal-600', 'teal-300');

  return (
    <Box
      as="nav"
      aria-label="Main navigation"
      position={{ base: 'sticky', lg: activePath === '/' ? 'fixed' : 'sticky' }}
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
        <Tabs.Root variant="plain" value={activePath} navigate={({ value }) => navigate(value)}>
          <Tabs.List gap={{ base: 1, sm: 2 }}>
            {NAV_TABS.map((tab) => (
              <Tabs.Trigger
                asChild
                key={tab.label}
                value={tab.path}
                transition="all 0.3s"
                color="description"
                px={{ base: 0, lg: 4 }}
                py={{ base: 0, lg: 2 }}
                minH={{ base: '44px', lg: 10 }}
                borderRadius="xl"
                _focusVisible={{
                  boxShadow: `inset 0 0 0 2px color-mix(in srgb, var(--chakra-colors-${activePath === tab.path ? 'teal-600' : focusRingColor}) 80%, var(--chakra-colors-gray-500))`,
                }}
                fontSize={{ base: '0.9375rem', lg: 'md' }}
                lineHeight={{ base: '1.25rem', lg: 'base' }}
                textTransform="capitalize"
                _hover={{ color: activePath !== tab.path ? hoverColor : undefined }}
                _selected={{ bg: { base: 'transparent', lg: 'gray.100' }, color: 'gray.800' }}
              >
                <NavLink to={tab.path} end={tab.path === '/'}>
                  <Box
                    as="span"
                    display="flex"
                    alignItems="center"
                    h={{ base: 10, lg: 'auto' }}
                    px={{ base: 2.5, sm: 4, lg: 0 }}
                    borderRadius="xl"
                    bg={{
                      base: activePath === tab.path ? 'gray.100' : 'transparent',
                      lg: 'transparent',
                    }}
                  >
                    {tab.label}
                  </Box>
                </NavLink>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
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
                <Menu.Content>
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
