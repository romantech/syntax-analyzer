import { Flex, type FlexProps, Heading, HStack, Link, Stack, Text } from '@chakra-ui/react';
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
  const descriptionContent = (
    <Stack key="description" maxW={400} gap={8}>
      <Heading
        bgGradient="linear(to-r, teal.300, yellow.400 70%)"
        bgClip="text"
        whiteSpace="pre-line"
      >
        {title}
      </Heading>
      <Stack gap={4}>
        <Text fontSize="xl">{description}</Text>
        <Link as={NavLink} color="teal.300" to={linkUrl} w="fit-content">
          Try it now
        </Link>
      </Stack>
    </Stack>
  );

  const image = <LazyImage key="image" {...imageProps} maxW={540} />;

  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      scrollSnapAlign="start"
      position="relative"
      {...flexProps}
    >
      <HStack flexGrow={1} justify="center" align="start" gap={12}>
        {imageFirst ? [image, descriptionContent] : [descriptionContent, image]}
      </HStack>
      <ScrollDownButton onClick={onScrollDown} hidden={!onScrollDown} />
    </Flex>
  );
};
