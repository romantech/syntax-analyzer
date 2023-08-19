import { Heading, HStack, StackProps } from '@chakra-ui/react';
import { LazyImage } from '@/base';

const src = `${import.meta.env.VITE_IMAGE_KIT_BASE_URL}/feature-1.png`;
const placeholderSrc = `${src}?tr=bl-30,q-50`;

export default function AnalyzerOverview(props: StackProps) {
  return (
    <HStack
      gap={10}
      align="center"
      justify="center"
      h="100vh"
      scrollSnapAlign="start"
      {...props}
    >
      <LazyImage
        src={src}
        placeholderSrc={placeholderSrc}
        alt="Analyzer Overview"
        maxW={540}
      />
      <Heading>Analyzer Description Section</Heading>
    </HStack>
  );
}
