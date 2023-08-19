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
import { ScrollDownButton } from '@/features/misc';
import { FunctionComponent } from 'react';

type ImageProps = {
  src: string;
  placeholderSrc: string;
  alt: string;
};

export interface ShowcaseTemplateProps extends FlexProps {
  imageProps: ImageProps;
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
    <Stack maxW={350} gap={8}>
      <Heading
        bgGradient="linear(to-r, teal.300, yellow.400 70%)"
        bgClip="text"
        whiteSpace="pre-line"
      >
        {title}
      </Heading>
      <Stack gap={4}>
        <Text fontSize="xl">{description}</Text>
        <Link as={NavLink} color="teal.300" to={linkUrl}>
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
