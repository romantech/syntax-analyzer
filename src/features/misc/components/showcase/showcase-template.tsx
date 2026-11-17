import {
  Flex,
  type FlexProps,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router';

import { LazyImage, type LazyImageProps } from '@/base';
import ScrollDownButton from './scroll-down-button';

export interface ShowcaseTemplateProps extends FlexProps {
  imageProps: LazyImageProps;
  title: string;
  description: string;
  linkUrl: string;
  imageFirst?: boolean;
  onScrollDown?: () => void;
}

export const ShowcaseTemplate = ({
  imageProps,
  title,
  description,
  linkUrl,
  onScrollDown,
  imageFirst = true,
  ...flexProps
}: ShowcaseTemplateProps) => {
  const gradient = useColorModeValue(
    'linear(to-r, teal.700, yellow.800 70%)',
    'linear(to-r, teal.300, yellow.400 70%)',
  );
  const linkColor = useColorModeValue('teal.700', 'teal.300');

  return (
    <Flex
      direction="column"
      minH={{ lg: '100vh' }}
      py={{ base: 8, lg: 0 }}
      align="center"
      justify="center"
      scrollSnapAlign="start"
      position="relative"
      {...flexProps}
    >
      <Stack
        w="full"
        direction={{ base: 'column', lg: imageFirst ? 'row-reverse' : 'row' }}
        justify="center"
        align={{ base: 'center', lg: 'start' }}
        gap={{ base: 6, lg: 12 }}
      >
        <Stack w="full" maxW={{ base: 540, lg: 400 }} gap={{ base: 3, lg: 8 }}>
          <Heading
            size={{ base: 'lg', lg: 'xl' }}
            bgGradient={gradient}
            bgClip="text"
            whiteSpace="pre-line"
          >
            {title}
          </Heading>
          <Stack gap={4}>
            <Text fontSize={{ base: 'md', lg: 'xl' }}>{description}</Text>
            <Link
              as={NavLink}
              color={linkColor}
              to={linkUrl}
              w="fit-content"
              display="inline-flex"
              alignItems="center"
              minH={{ base: '44px', lg: 'auto' }}
            >
              Try it now
            </Link>
          </Stack>
        </Stack>
        <LazyImage {...imageProps} maxW={540} />
      </Stack>
      <ScrollDownButton onClick={onScrollDown} hidden={!onScrollDown} />
    </Flex>
  );
};
