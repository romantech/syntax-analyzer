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
import { useTranslation } from 'react-i18next';
import { BsGithub } from 'react-icons/bs';
import { FiCoffee, FiMoreHorizontal } from 'react-icons/fi';
import { MdModeNight, MdOutlineLightMode } from 'react-icons/md';
import { NavLink, useLocation } from 'react-router';

import { SITE_URLS } from '@/routes/paths';

import { LanguageMenu } from './language-menu';

export function Header() {
  const { t } = useTranslation();
  const navLinks = [
    { label: t('nav.home'), path: SITE_URLS.ROOT },
    { label: t('nav.analyzer'), path: SITE_URLS.ANALYZER.ROOT },
    { label: t('nav.editor'), path: SITE_URLS.EDITOR.ROOT },
  ] as const;

  const externalLinks = [
    {
      label: t('nav.donate'),
      href: 'https://www.buymeacoffee.com/colorfilter',
      icon: FiCoffee,
    },
    {
      label: t('nav.github'),
      href: 'https://github.com/romantech/syntax-analyzer',
      icon: BsGithub,
    },
  ] as const;
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();

  const ToggleIcon = theme === 'light' ? MdModeNight : MdOutlineLightMode;

  return (
    <Box
      as="nav"
      aria-label={t('nav.main')}
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
      bg={{ base: 'bg', lg: 'bg/80' }}
      boxShadow="sm"
    >
      <HStack maxW="8xl" mx="auto" gap={{ base: 0, sm: 2 }}>
        <HStack gap={{ base: 0, sm: 2 }}>
          {navLinks.map(({ label, path }) => (
            <Flex
              asChild
              key={path}
              align="center"
              transitionProperty="background-color, color"
              transitionDuration="0.3s"
              color="fg.muted"
              px={{ base: 0, lg: 4 }}
              py={{ base: 0, lg: 2 }}
              minH={{ base: '44px', lg: 10 }}
              borderRadius="xl"
              fontWeight="semibold"
              fontSize={{ base: '0.875rem', sm: '0.9375rem', lg: 'md' }}
              lineHeight={{ base: '1.25rem', lg: 'base' }}
              _hover={{
                '&:not([aria-current=page])': {
                  color: 'fg',
                  bg: { lg: 'gray.subtle' },
                  '& > span': { bg: { base: 'gray.subtle', lg: 'transparent' } },
                },
              }}
              _currentPage={{
                color: 'fg',
                bg: { lg: 'gray.muted' },
                '& > span': { bg: { base: 'gray.muted', lg: 'transparent' } },
              }}
            >
              <NavLink to={path} end={path === SITE_URLS.ROOT}>
                <Box
                  as="span"
                  display="flex"
                  alignItems="center"
                  h={{ base: 10, lg: 'auto' }}
                  px={{ base: 1.5, sm: 4, lg: 0 }}
                  borderRadius="xl"
                >
                  {label}
                </Box>
              </NavLink>
            </Flex>
          ))}
        </HStack>
        <Spacer />
        <Flex align="center" gap={0} flexShrink={0}>
          <Flex display={{ base: 'none', sm: 'flex' }}>
            {externalLinks.map(({ label, href, icon }) => (
              <Button key={href} asChild variant="ghost">
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon as={icon} boxSize="1.2rem" />
                </a>
              </Button>
            ))}
          </Flex>
          <LanguageMenu />
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="ghost"
            aria-label={t('nav.toggleTheme')}
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
                aria-label={t('nav.moreLinks')}
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
                      outlineColor: 'colorPalette.focusRing',
                      outlineOffset: '-2px',
                    },
                  }}
                >
                  {externalLinks.map(({ label, href, icon: LinkIcon }) => (
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
