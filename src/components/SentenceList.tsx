import {
  Box,
  Card,
  CardBody,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
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
import { TbMoodEmpty } from 'react-icons/tb';
import { getFormattedKoDate } from '@/utils/dates';

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
      <Box borderRadius="lg" borderWidth={1} w="full" maxW="container.md" p={4}>
        <Tabs defaultIndex={DEFAULT_SENTENCE_LIST_TAB}>
          <TabList>
            {SENTENCE_TABS.map(({ label }) => (
              <Tab key={label}>{label}</Tab>
            ))}
          </TabList>

          <TabPanels pt={4}>
            {SENTENCE_TABS.map(({ from, label }) => (
              <TabPanel p={0} key={label}>
                <Card variant="outline" maxH={380} overflowY="auto">
                  <CardBody p={2.5}>
                    <Stack divider={<StackDivider />}>
                      {!combinedAnalysisList[from].length && (
                        <Text
                          display="flex"
                          alignItems="center"
                          gap={2}
                          p={1.5}
                        >
                          아직 추가한 문장이 없어요
                          <Icon as={TbMoodEmpty} />
                        </Text>
                      )}
                      {combinedAnalysisList[from].map((analysis, i) => (
                        <VStack key={analysis.id} align="start" gap={0} p={1.5}>
                          <HStack w="full" justify="space-between">
                            <Text as="span" fontSize="xs" color="gray.500">
                              {getFormattedKoDate(analysis.createdAt)}
                            </Text>
                            <DeleteAnalysisButton
                              onConfirm={() => removeUserAnalysis(analysis.id)}
                              hidden={from === 'sample'}
                            />
                          </HStack>
                          <Text
                            noOfLines={1}
                            cursor="pointer"
                            _hover={{ color: 'blue.300' }}
                            onClick={() => onSentenceClick(from, i)}
                          >
                            {tokenJoiner(analysis.sentence)}
                          </Text>
                        </VStack>
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
        headerContent="영어 문장 선택"
        bodyContent="선택한 문장을 편집하시겠습니까?"
      />
    </Fragment>
  );
}
