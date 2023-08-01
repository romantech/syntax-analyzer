import {
  Box,
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
  combinedAnalysisListAtom,
  currentAnalysisAtom,
  removeUserAnalysisActionAtom,
} from '@/store/analysisStore';
import { ConfirmModal } from '@/components/common';
import React, { Fragment, useRef } from 'react';
import { Analysis } from '@/types/analysis';
import { DEFAULT_SENTENCE_LIST_TAB } from '@/constants/config';
import { SENTENCE_TABS } from '@/constants/tabList';
import { useNavigate } from 'react-router-dom';
import { getSyntaxTaggingPath } from '@/constants/siteUrls';
import DeletableSentence from './DeletableSentence';
import { TextPlaceholder } from '@/components';
import { TbMoodEmpty } from 'react-icons/tb';

export default function SentenceList() {
  const selectedAnalysis = useRef<Analysis>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const combinedAnalysisList = useAtomValue(combinedAnalysisListAtom);
  const setCurrentAnalysis = useSetAtom(currentAnalysisAtom);
  const removeUserAnalysis = useSetAtom(removeUserAnalysisActionAtom);

  const onSentenceClick = (analysis: Analysis) => {
    onOpen();
    selectedAnalysis.current = analysis;
  };

  const onSelectSentenceConfirm = () => {
    if (selectedAnalysis.current) {
      setCurrentAnalysis(selectedAnalysis.current);
      onClose();
      navigate(getSyntaxTaggingPath(selectedAnalysis.current.id));
    }
  };

  return (
    <Fragment>
      <Box borderRadius="lg" borderWidth={1} w="full" maxW="container.md" p={4}>
        <Tabs defaultIndex={DEFAULT_SENTENCE_LIST_TAB}>
          <TabList>
            {SENTENCE_TABS.map(({ label }) => (
              <Tab key={label}>{label}</Tab>
            ))}
          </TabList>

          <TabPanels pt={4}>
            {SENTENCE_TABS.map(({ source, label }) => {
              const isEmpty = !combinedAnalysisList[source].length;
              return (
                <TabPanel p={0} key={label}>
                  <Card variant="outline" maxH={460} overflowY="auto">
                    <CardBody p={2.5}>
                      <Stack divider={<StackDivider />}>
                        <TextPlaceholder
                          p={1.5}
                          text="아직 추가한 문장이 없어요"
                          hidden={!isEmpty}
                          endIcon={TbMoodEmpty}
                        />

                        {combinedAnalysisList[source].map((analysis) => (
                          <DeletableSentence
                            key={analysis.id}
                            createdAt={analysis.createdAt}
                            sentence={analysis.sentence}
                            hideDeleteButton={source === 'sample'}
                            onClick={() => onSentenceClick(analysis)}
                            onDelete={() => removeUserAnalysis(analysis.id)}
                          />
                        ))}
                      </Stack>
                    </CardBody>
                  </Card>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Box>
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
