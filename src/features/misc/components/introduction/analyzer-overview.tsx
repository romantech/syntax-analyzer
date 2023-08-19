import {
  Flex,
  FlexProps,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LazyImage } from '@/base';
import { NavLink } from 'react-router-dom';
import { SITE_URLS } from '@/routes';
import { ScrollDownButton } from '@/features/misc';

const src = `${import.meta.env.VITE_IMAGE_KIT_BASE_URL}/feature-1.png`;
const placeholderSrc = `${src}?tr=bl-30,q-50`;

interface AnalyzerOverviewProps extends FlexProps {
  onScrollDown?: () => void;
}

export default function AnalyzerOverview({
  onScrollDown,
  ...flexProps
}: AnalyzerOverviewProps) {
  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      scrollSnapAlign="start"
      position="relative"
      {...flexProps}
    >
      <HStack flexGrow={1} justify="center" align="start" gap={10}>
        <LazyImage
          src={src}
          placeholderSrc={placeholderSrc}
          alt="Analyzer Overview"
          maxW={540}
        />
        <Stack maxW={350} gap={8}>
          <Heading
            bgGradient="linear(to-r, teal.300, yellow.400 70%)"
            bgClip="text"
            whiteSpace="pre-line"
          >{`Syntax Unpacked\n with a Single Click`}</Heading>
          <Stack gap={4}>
            <Text fontSize="xl">
              Just type in your text, choose a model, and watch as we unravel
              the intricacies of subjects, verbs, objects, and more.
            </Text>
            <Link
              as={NavLink}
              color="teal.300"
              to={SITE_URLS.SYNTAX_ANALYZER.ROOT}
            >
              Try it now
            </Link>
          </Stack>
        </Stack>
      </HStack>
      <ScrollDownButton onClick={onScrollDown} hidden={!onScrollDown} />
    </Flex>
  );
}
