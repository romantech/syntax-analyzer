import {
  Button,
  Container,
  Flex,
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
    path: SITE_URLS.SYNTAX_ANALYZER.ROOT,
    matchPath: `${SITE_URLS.SYNTAX_ANALYZER.ROOT}/*`,
  },
  {
    label: 'editor',
    path: SITE_URLS.SYNTAX_EDITOR.ROOT,
    matchPath: `${SITE_URLS.SYNTAX_EDITOR.ROOT}/*`,
  },
] as const;

const useTabIndex = () => {
  const { pathname } = useLocation();
  return NAV_TABS.findIndex((tab) => matchPath(tab.matchPath, pathname));
};

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const ToggleIcon = colorMode === 'light' ? MdModeNight : MdOutlineLightMode;
  const tabIndex = useTabIndex();

  return (
    <Container
      position="sticky"
      display="flex"
      maxW="8xl"
      as="nav"
      py={4}
      boxShadow={useColorModeValue('sm', 'md')}
    >
      <Tabs variant="soft-rounded" index={tabIndex} colorScheme="gray">
        <TabList>
          {NAV_TABS.map((tab, i) => (
            <Tab
              as={NavLink}
              key={tab.label}
              to={tab.path}
              transition="all 0.3s"
              textTransform="capitalize"
              _hover={{ color: tabIndex !== i ? 'gray.400' : '' }}
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
    </Container>
  );
}
