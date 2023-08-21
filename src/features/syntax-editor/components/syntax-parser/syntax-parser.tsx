import { useRef } from 'react';
import { SlideFade } from '@chakra-ui/react';
import {
  SegmentList,
  Sentence,
  TokenList,
  useCalculateNestingLevel,
  useSyntaxParserAnalysis,
} from '@/features/syntax-editor';
import { TbMoodEmpty } from 'react-icons/tb';
import { TextPlaceholder, ThreeDotsWave, useTransitionLoading } from '@/base';
import '@/features/syntax-editor/styles/constituent.scss';

/**
 * 데이터(초기값 null)를 받아오는 과정에서 TextPlaceholder 가 잠깐 보이는 문제 발생
 * 이를 해결하기 위해 isLoading 상태 변화를 지연시켜서 데이터를 완전히 불러오기 전까진
 * 스피너를 표시하고, 데이터를 모두 불러온 후 결과에 따라 플레이스 홀더 표시하도록 처리.
 * Transition 에 등록한 상태는 우선순위가 낮은 업데이트로 작동하고, 우선 순위가 낮은
 * 업데이트는 우선순위가 높은 업데이트에 의해 즉시 중단될 수 있음. useEffect 종속성
 * 배열에 데이터를 등록해서, 데이터가 변경될 때마다 이펙트 함수가 호출되고, 이때마다
 * 진행중이던 isLoading 상태 업데이트가 중단됨. 이런식으로 항상 isLoading 상태가 데이터를
 * 완전히 불러온 후에만 false 로 변경되도록 보장할 수 있음.
 * */
export default function SyntaxParser() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);

  const { segment, sentence } = useSyntaxParserAnalysis();
  const isLoading = useTransitionLoading([segment, sentence]);
  const isNestingLevelCalculated = useCalculateNestingLevel({
    targetRef: sentenceRef,
    trigger: isLoading,
  });

  if (isLoading) return <ThreeDotsWave delay={300} />;

  if (!segment || !sentence) {
    return (
      <TextPlaceholder
        fontSize="3xl"
        fontWeight="bold"
        pl={4}
        text="선택한 문장이 없어요"
        endIcon={TbMoodEmpty}
      />
    );
  }

  return (
    <SlideFade in={isNestingLevelCalculated} offsetY={100}>
      <Sentence ref={sentenceRef}>
        <SegmentList
          segment={segment}
          tokenElements={TokenList({ sentence })}
        />
      </Sentence>
    </SlideFade>
  );
}
