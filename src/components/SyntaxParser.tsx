import { sampleData } from '@/constants/dummy.ts';
import { Segments, TokenList } from '@/components';
import { SlideFade, Text, useBoolean } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { calculateNestingLevel } from '@/utils/nestingLevelCalculators.ts';
import '@/styles/constituent.scss';

export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const { rootSegment, sentence } = sampleData;
  const [show, setShow] = useBoolean();

  useEffect(() => {
    if (sentenceRef.current) {
      calculateNestingLevel(sentenceRef);
      setShow.on();
    }
  }, [setShow]);

  return (
    <SlideFade in={show} offsetY={100}>
      <Text fontSize="4xl" ref={sentenceRef} whiteSpace="nowrap">
        <Segments
          key={rootSegment.id}
          segment={rootSegment}
          tokenElements={TokenList({ sentence })}
        />
      </Text>
    </SlideFade>
  );
}
