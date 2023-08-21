import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Spacer,
  Tab,
  TabList,
  Tabs,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdModeNight, MdOutlineLightMode } from 'react-icons/md';
import { BsGithub } from 'react-icons/bs';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

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

const useTabIndex = () => {
  const { pathname } = useLocation();
  return NAV_TABS.findIndex((tab) => matchPath(tab.matchPath, pathname));
};

export function Header() {
  const tabIndex = useTabIndex();
  const { colorMode, toggleColorMode } = useColorMode();

  const ToggleIcon = colorMode === 'light' ? MdModeNight : MdOutlineLightMode;

  const bg = useColorModeValue('whiteAlpha.800', 'grayAlpha.800');
  const boxShadow = useColorModeValue('sm', 'lg');
  const hoverColor = useColorModeValue('gray.400', 'gray.100');

  const position = tabIndex === 0 ? 'fixed' : 'sticky';

  return (
    <Box
      as="nav"
      position={position}
      w="full"
      top={0}
      p={4}
      zIndex={10}
      backdropFilter="blur(10px)"
      bg={bg}
      boxShadow={boxShadow}
    >
      <HStack maxW="8xl" mx="auto">
        <Tabs variant="soft-rounded" index={tabIndex} colorScheme="gray">
          <TabList>
            {NAV_TABS.map((tab, i) => (
              <Tab
                as={NavLink}
                key={tab.label}
                to={tab.path}
                transition="all 0.3s"
                color="description"
                textTransform="capitalize"
                _hover={{ color: tabIndex !== i ? hoverColor : '' }}
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Spacer />
        <Flex align="center">
          <Button
            variant="ghost"
            as="a"
            target="_blank"
            aria-label="Github repository"
            href="https://github.com/romantech/syntax-analyzer"
          >
            <Icon as={BsGithub} boxSize="1.2rem" />
          </Button>
          <Button
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          >
            <Icon as={ToggleIcon} boxSize="1.2rem" />
          </Button>
        </Flex>
      </HStack>
    </Box>
  );
}
