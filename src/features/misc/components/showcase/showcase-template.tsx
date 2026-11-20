import { Flex, type FlexProps, Heading, Link, Stack, Text } from '@chakra-ui/react';
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
  return (
    <Flex direction="column" align="center" justify="center" scrollSnapAlign="start" {...flexProps}>
      <Stack
        w="full"
        direction={{ base: 'column', lg: imageFirst ? 'row-reverse' : 'row' }}
        justify="center"
        align={{ base: 'center', lg: 'start' }}
        gap={{ base: 4, lg: 12 }}
      >
        <Stack w="full" maxW={{ base: 540, lg: 400 }} gap={{ base: 3, lg: 8 }}>
          <Heading
            fontSize={{ base: '1.75rem', lg: '4xl' }}
            lineHeight={{ base: 1.33, md: 1.2 }}
            bgImage="linear-gradient(to right, var(--chakra-colors-teal-700), var(--chakra-colors-yellow-800) 70%)"
            bgClip="text"
            color="transparent"
            _dark={{
              bgImage:
                'linear-gradient(to right, var(--chakra-colors-teal-300), var(--chakra-colors-yellow-400) 70%)',
            }}
            whiteSpace="pre-line"
          >
            {title}
          </Heading>
          <Stack gap={4}>
            <Text
              fontSize={{ base: '1.0625rem', lg: 'xl' }}
              lineHeight={{ base: '1.6875rem', lg: 'base' }}
            >
              {description}
            </Text>
            <Link
              asChild
              color="teal.700"
              _hover={{ color: 'teal.600', textDecoration: 'none' }}
              _dark={{ color: 'teal.300', _hover: { color: 'teal.200' } }}
              w="fit-content"
              display="inline-flex"
              alignItems="center"
              minH={{ base: '44px', lg: 'auto' }}
            >
              <NavLink to={linkUrl}>Try it now</NavLink>
            </Link>
          </Stack>
        </Stack>
        <LazyImage {...imageProps} maxW={540} />
      </Stack>
      <ScrollDownButton onClick={onScrollDown} hidden={!onScrollDown} />
    </Flex>
  );
};
