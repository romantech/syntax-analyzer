import { Center, CenterProps, Heading } from '@chakra-ui/react';

export default function AnalyzerOverview(props: CenterProps) {
  return (
    <Center id="section2" h="100vh" scrollSnapAlign="start" {...props}>
      <Heading>Analyzer Description Section</Heading>
    </Center>
  );
}
