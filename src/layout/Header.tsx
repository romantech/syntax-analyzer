import {
  Box,
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
import { TAB_LIST } from '@/constants/tabList';
import { useTabIndex } from '@/hooks';

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const ToggleIcon = colorMode === 'light' ? MdModeNight : MdOutlineLightMode;
  const tabIndex = useTabIndex();

  return (
    <Fragment>
      <Flex as="nav" align="center" py={4}>
        <Flex align="center">
          <Box>
            <Heading size="md" textTransform="uppercase" fontWeight="extrabold">
              syntax analyzer
            </Heading>
          </Box>
          <Box ml={6}>
            <Tabs variant="soft-rounded" defaultIndex={tabIndex}>
              <TabList>
                {TAB_LIST.map((tab) => (
                  <NavLink to={tab.path} key={tab.label}>
                    <Tab textTransform="capitalize">{tab.label}</Tab>
                  </NavLink>
                ))}
              </TabList>
            </Tabs>
          </Box>
        </Flex>
        <Spacer />
        <Flex align="center">
          <Button
            variant="ghost"
            as="a"
            target="_blank"
            href="https://github.com/romantech/syntax-analyzer-front"
          >
            <Icon as={BsGithub} boxSize="1.2rem" />
          </Button>
          <Button onClick={toggleColorMode} variant="ghost">
            <Icon as={ToggleIcon} boxSize="1.2rem" />
          </Button>
        </Flex>
      </Flex>
      <Divider />
    </Fragment>
  );
}
