import {
  Flex,
  FlexProps,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

import { LazyImage, LazyImageProps } from '@/base';
import { ScrollDownButton } from '@/features/misc';

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
  const Contents: FunctionComponent[] = [];

  const Description = () => (
    <Stack maxW={400} gap={8}>
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

  const Image = () => <LazyImage {...imageProps} maxW={540} />;

  if (imageFirst) Contents.push(Image, Description);
  else Contents.push(Description, Image);

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
        {Contents.map((Content, i) => (
          <Content key={i} />
        ))}
      </HStack>
      <ScrollDownButton onClick={onScrollDown} hidden={!onScrollDown} />
    </Flex>
  );
};
