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
  currentAnalysisIndexAtom,
  removeUserAnalysisActionAtom,
} from '@/store/analysisStore';
import { ConfirmModal } from '@/components/common';
import React, { Fragment, useRef } from 'react';
import { CurrentAnalysisInfo } from '@/types/analysis';
import { DEFAULT_SENTENCE_LIST_TAB } from '@/constants/config';
import { SENTENCE_TABS } from '@/constants/tabList';
import { useNavigate } from 'react-router-dom';
import { getSyntaxTaggingPath } from '@/constants/siteUrls';
import FallbackSentence from './FallbackSentence';
import DeletableSentence from './DeletableSentence';

export default function SentenceList() {
  const selected = useRef<CurrentAnalysisInfo>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const combinedAnalysisList = useAtomValue(combinedAnalysisListAtom);
  const setCurrentAnalysisIndex = useSetAtom(currentAnalysisIndexAtom);
  const removeUserAnalysis = useSetAtom(removeUserAnalysisActionAtom);

  const onSentenceClick = (analysisInfo: CurrentAnalysisInfo) => {
    onOpen();
    selected.current = analysisInfo;
  };

  const onSelectSentenceConfirm = () => {
    if (selected.current) {
      setCurrentAnalysisIndex(selected.current);
      onClose();
      navigate(getSyntaxTaggingPath(selected.current.id));
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
                        {isEmpty && <FallbackSentence gap={2} p={1.5} />}
                        {combinedAnalysisList[source].map(
                          ({ id, createdAt, sentence }, index) => {
                            const analysisInfo = { index, source, id };
                            return (
                              <DeletableSentence
                                key={id}
                                createdAt={createdAt}
                                sentence={sentence}
                                hideDeleteButton={source === 'sample'}
                                onClick={() => onSentenceClick(analysisInfo)}
                                onDelete={() => removeUserAnalysis(id)}
                              />
                            );
                          },
                        )}
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
