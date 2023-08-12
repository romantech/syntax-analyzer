import {
  Card,
  CardBody,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  analysisListBySourceAtom,
  removeUserAnalysisActionAtom,
  selectedAnalysisAtom,
} from 'src/features/syntax-editor/store';
import { ConfirmModal, TextPlaceholder } from '@/base';
import { Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { TbMoodEmpty } from 'react-icons/tb';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  AnalysisSource,
  DeletableSentence,
  TAnalysis,
} from '@/features/syntax-editor';

import { getSyntaxEditorPath } from '@/routes';

import { DEFAULT_SENTENCE_LIST_TAB } from '@/features/syntax-editor/constants';

type AnalysisInfo = { index: number; analysis: TAnalysis };

interface SentenceListProps {
  tabIndex?: number;
  onTabChange?: (index: number) => void;
}

const TAB_LIST: { label: string; source: AnalysisSource }[] = [
  { label: '추가한 문장', source: 'user' },
  { label: '샘플 문장', source: 'sample' },
];

export default function SentenceList({
  tabIndex,
  onTabChange,
}: SentenceListProps) {
  const selectedAnalysis = useRef<AnalysisInfo>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const combinedAnalysisList = useAtomValue(analysisListBySourceAtom);
  const setSelectedAnalysis = useSetAtom(selectedAnalysisAtom);
  const removeUserAnalysis = useSetAtom(removeUserAnalysisActionAtom);

  const [parent] = useAutoAnimate();

  const onSentenceClick = (analysisInfo: AnalysisInfo) => {
    onOpen();
    selectedAnalysis.current = analysisInfo;
  };

  const onSelectSentenceConfirm = () => {
    if (!selectedAnalysis.current) return;

    const { analysis, index } = selectedAnalysis.current;
    setSelectedAnalysis(analysis);
    navigate(getSyntaxEditorPath(analysis.source, index));
  };

  return (
    <Fragment>
      <Tabs
        defaultIndex={DEFAULT_SENTENCE_LIST_TAB}
        index={tabIndex}
        onChange={onTabChange}
        colorScheme="teal"
      >
        <TabList>
          {TAB_LIST.map(({ label }) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </TabList>

        <TabPanels pt={4}>
          {TAB_LIST.map(({ source, label }) => (
            <TabPanel p={0} key={label}>
              <Card variant="outline" maxH={460} overflowY="auto">
                <CardBody p={2.5}>
                  <Stack
                    divider={<StackDivider />}
                    ref={parent}
                    overflowY="hidden"
                  >
                    {!combinedAnalysisList[source].length && (
                      <TextPlaceholder
                        p={1.5}
                        text="아직 추가한 문장이 없어요"
                        endIcon={TbMoodEmpty}
                      />
                    )}
                    {combinedAnalysisList[source].map((analysis, index) => (
                      <DeletableSentence
                        key={analysis.id}
                        createdAt={analysis.createdAt}
                        sentence={analysis.sentence}
                        hideDeleteButton={source === 'sample'}
                        onClick={() => onSentenceClick({ analysis, index })}
                        onDelete={() => removeUserAnalysis(analysis.id)}
                        showGPTBadge={analysis.isAnalyzedByGPT}
                      />
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSelectSentenceConfirm}
        headerContent="영어 문장 선택"
        bodyContent="선택한 문장을 편집하시겠습니까?"
      />
    </Fragment>
  );
}
