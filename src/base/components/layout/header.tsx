import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spacer,
  Tab,
  TabList,
  Tabs,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { BsGithub } from 'react-icons/bs';
import { FiCoffee, FiMoreHorizontal } from 'react-icons/fi';
import { MdModeNight, MdOutlineLightMode } from 'react-icons/md';
import { matchPath, NavLink, useLocation } from 'react-router';

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

const useTabIndex = () => {
  const { pathname } = useLocation();
  return NAV_TABS.findIndex((tab) => matchPath(tab.matchPath, pathname));
};

export function Header() {
  const tabIndex = useTabIndex();
  const { colorMode, toggleColorMode } = useColorMode();

  const ToggleIcon = colorMode === 'light' ? MdModeNight : MdOutlineLightMode;

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
      position={{ base: 'sticky', lg: tabIndex === 0 ? 'fixed' : 'sticky' }}
      w="full"
      top={0}
      p={{ base: 2, lg: 4 }}
      zIndex={10}
      backdropFilter="blur(10px)"
      bg={bg}
      boxShadow={boxShadow}
    >
      <HStack maxW="8xl" mx="auto" spacing={{ base: 0, sm: 2 }}>
        <Tabs variant="soft-rounded" index={tabIndex} colorScheme="gray">
          <TabList gap={{ base: 1, sm: 2, lg: 0 }}>
            {NAV_TABS.map((tab, i) => (
              <Tab
                as={NavLink}
                key={tab.label}
                to={tab.path}
                transition="all 0.3s"
                color="description"
                px={{ base: 0, lg: 4 }}
                py={{ base: 0, lg: 2 }}
                minH={{ base: '44px', lg: 10 }}
                textTransform="capitalize"
                _hover={{ color: tabIndex !== i ? hoverColor : '' }}
                _selected={{ bg: { base: 'transparent', lg: 'gray.100' }, color: 'gray.800' }}
              >
                <Box
                  as="span"
                  px={{ base: 2, sm: 4, lg: 0 }}
                  py={{ base: 2.5, lg: 0 }}
                  borderRadius="full"
                  bg={{ base: tabIndex === i ? 'gray.100' : 'transparent', lg: 'transparent' }}
                >
                  {tab.label}
                </Box>
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Spacer />
        <Flex align="center">
          <Flex display={{ base: 'none', sm: 'flex' }}>
            {EXTERNAL_LINKS.map(({ label, href, icon }) => (
              <Button
                key={href}
                as="a"
                href={href}
                target="_blank"
                aria-label={label}
                variant="ghost"
              >
                <Icon as={icon} boxSize="1.2rem" />
              </Button>
            ))}
          </Flex>
          <Button
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
            minW={{ base: '44px', lg: 10 }}
            minH={{ base: '44px', lg: 10 }}
            px={{ base: 0, sm: 4 }}
          >
            <Icon as={ToggleIcon} boxSize="1.2rem" />
          </Button>
          <Menu placement="bottom-end" isLazy>
            <MenuButton
              as={IconButton}
              display={{ base: 'inline-flex', sm: 'none' }}
              aria-label="More links"
              icon={<Icon as={FiMoreHorizontal} boxSize="1.2rem" />}
              variant="ghost"
              boxSize="44px"
            />
            <Portal>
              <MenuList
                zIndex="dropdown"
                motionProps={{ variants: { enter: { opacity: 1 }, exit: { opacity: 0 } } }}
              >
                {EXTERNAL_LINKS.map(({ label, href, icon: LinkIcon }) => (
                  <MenuItem
                    key={href}
                    as="a"
                    href={href}
                    target="_blank"
                    icon={<LinkIcon />}
                    minH="44px"
                  >
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </HStack>
    </Box>
  );
}
