import {
  Box,
  Card,
  CardBody,
  HStack,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  combinedAnalysisListAtom,
  currentAnalysisIndexAtom,
  removeUserAnalysisActionAtom,
} from '@/store/analysisStore';
import { tokenJoiner } from '@/utils/string';
import { ConfirmModal } from '@/components/common';
import React, { Fragment, useRef } from 'react';
import { AnalysisFromType, CurrentAnalysisIndex } from '@/types/analysis';
import { DEFAULT_SENTENCE_LIST_TAB } from '@/constants/config';
import { SENTENCE_TABS } from '@/constants/tabList';
import DeleteAnalysisButton from '@/components/common/DeleteAnalysisButton';

export default function SentenceList() {
  const selected = useRef<CurrentAnalysisIndex>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const combinedAnalysisList = useAtomValue(combinedAnalysisListAtom);
  const setCurrentAnalysisIndex = useSetAtom(currentAnalysisIndexAtom);
  const removeUserAnalysis = useSetAtom(removeUserAnalysisActionAtom);

  const onSentenceClick = (from: AnalysisFromType, index: number) => {
    onOpen();
    selected.current = { from, index };
  };
  const onSelectSentenceConfirm = () => {
    if (selected.current) {
      setCurrentAnalysisIndex(selected.current);
      onClose();
    }
  };

  return (
    <Fragment>
      <Box
        borderRadius="lg"
        borderWidth={1}
        flexGrow={1}
        maxW="container.md"
        p={4}
      >
        <Tabs defaultIndex={DEFAULT_SENTENCE_LIST_TAB}>
          <TabList>
            {SENTENCE_TABS.map(({ label }) => (
              <Tab key={label}>{label}</Tab>
            ))}
          </TabList>

          <TabPanels pt={4}>
            {SENTENCE_TABS.map(({ from, label }) => (
              <TabPanel p={0} key={label}>
                <Card variant="outline" maxH={320} overflowY="auto">
                  <CardBody p={2.5}>
                    <Stack divider={<StackDivider />}>
                      {combinedAnalysisList[from].map((analysis, i) => (
                        <HStack key={analysis.id} justify="space-between">
                          <Text
                            noOfLines={1}
                            cursor="pointer"
                            _hover={{ color: 'blue.300' }}
                            onClick={() => onSentenceClick(from, i)}
                            p={1.5}
                          >
                            {tokenJoiner(analysis.sentence)}
                          </Text>
                          <DeleteAnalysisButton
                            onConfirm={() => removeUserAnalysis(analysis.id)}
                            hidden={from === 'sample'}
                          />
                        </HStack>
                      ))}
                    </Stack>
                  </CardBody>
                </Card>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSelectSentenceConfirm}
        headerText="영어 문장 선택"
        bodyText="선택한 문장을 편집하시겠습니까?"
      />
    </Fragment>
  );
}
