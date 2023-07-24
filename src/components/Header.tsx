import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  Spacer,
  Tab,
  TabList,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { MdModeNight, MdOutlineLightMode } from 'react-icons/md';
import { BsGithub } from 'react-icons/bs';
import { Fragment } from 'react';

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const ToggleIcon = colorMode === 'light' ? MdModeNight : MdOutlineLightMode;

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
            <Tabs variant="soft-rounded">
              <TabList>
                <Tab>Home</Tab>
                <Tab>Syntax Analyzer</Tab>
                <Tab>Syntax Editor</Tab>
              </TabList>
            </Tabs>
          </Box>
        </Flex>
        <Spacer />
        <Flex gap={1} align="center">
          <Button variant="ghost">
            <Link
              href="https://github.com/romantech/syntax-analyzer-front"
              isExternal
            >
              <Icon as={BsGithub} boxSize="1.2rem" />
            </Link>
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
