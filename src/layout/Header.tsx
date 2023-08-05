import {
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Spacer,
  Tab,
  TabList,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { MdModeNight, MdOutlineLightMode } from 'react-icons/md';
import { BsGithub } from 'react-icons/bs';
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_TABS } from '@/constants/tabList';
import { useTabIndex } from '@/hooks';

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const ToggleIcon = colorMode === 'light' ? MdModeNight : MdOutlineLightMode;
  const tabIndex = useTabIndex();

  return (
    <Fragment>
      <Flex as="nav" align="center" py={4}>
        <Flex align="center">
          <Heading size="md" textTransform="uppercase" fontWeight="extrabold">
            syntax analyzer
          </Heading>
          <Tabs variant="soft-rounded" index={tabIndex} ml={6}>
            <TabList>
              {NAV_TABS.map((tab) => (
                <Tab
                  as={NavLink}
                  key={tab.label}
                  to={tab.path}
                  textTransform="capitalize"
                  _focus={{ boxShadow: 'none' }}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Flex>
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
      </Flex>
      <Divider />
    </Fragment>
  );
}
