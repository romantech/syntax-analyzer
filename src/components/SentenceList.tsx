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
  TextProps,
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
import { ConfirmModal, DateChip, DeleteIconButton } from '@/components/common';
import React, { Fragment, useRef } from 'react';
import { CurrentAnalysisInfo } from '@/types/analysis';
import { DEFAULT_SENTENCE_LIST_TAB } from '@/constants/config';
import { SENTENCE_TABS } from '@/constants/tabList';
import { TbMoodEmpty } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { getSyntaxTaggingPath } from '@/constants/siteUrls';

const SentenceNotAdded = ({ ...textProps }: TextProps) => {
  return (
    <Text display="flex" alignItems="center" {...textProps}>
      아직 추가한 문장이 없어요
      <Icon as={TbMoodEmpty} />
    </Text>
  );
};

export default function SentenceList() {
  const selected = useRef<CurrentAnalysisInfo>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const combinedAnalysisList = useAtomValue(combinedAnalysisListAtom);
  const setCurrentAnalysisIndex = useSetAtom(currentAnalysisIndexAtom);
  const removeUserAnalysis = useSetAtom(removeUserAnalysisActionAtom);

  const onClick = (analysisInfo: CurrentAnalysisInfo) => {
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
                        {isEmpty && <SentenceNotAdded gap={2} p={1.5} />}
                        {combinedAnalysisList[source].map(
                          ({ id, createdAt, sentence }, index) => (
                            <VStack key={id} align="start" gap={0} p={1.5}>
                              <HStack w="full" justify="space-between">
                                <DateChip date={createdAt} h={5} />
                                <DeleteIconButton
                                  onConfirm={() => removeUserAnalysis(id)}
                                  hidden={source === 'sample'}
                                  popoverHeader="선택한 문장을 삭제하시겠습니까?"
                                />
                              </HStack>
                              <Text
                                noOfLines={1}
                                cursor="pointer"
                                _hover={{ color: 'blue.300' }}
                                onClick={() => onClick({ source, index, id })}
                              >
                                {tokenJoiner(sentence)}
                              </Text>
                            </VStack>
                          ),
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
