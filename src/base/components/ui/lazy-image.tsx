import { AspectRatio, AspectRatioProps, Image } from '@chakra-ui/react';
import { Fragment, useState } from 'react';

interface LazyImageProps extends AspectRatioProps {
  src: string;
  placeholderSrc: string;
  alt: string;
}

export default function LazyImage({
  src,
  alt,
  maxW = 540,
  placeholderSrc,
  ...aspectRatioProps
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <AspectRatio
      position="relative"
      borderRadius="lg"
      overflow="hidden"
      bg="gray.300"
      ratio={4 / 3}
      w="full"
      maxW={maxW}
      {...aspectRatioProps}
    >
      <Fragment>
        <Image
          position="absolute"
          fit="cover"
          src={placeholderSrc}
          alt={`${alt} (Placeholder)`}
        />
        <Image
          position="absolute"
          fit="cover"
          onLoad={() => setIsLoaded(true)}
          src={src}
          alt={alt}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.7s ease-in-out"
          loading="lazy"
        />
      </Fragment>
    </AspectRatio>
  );
}
