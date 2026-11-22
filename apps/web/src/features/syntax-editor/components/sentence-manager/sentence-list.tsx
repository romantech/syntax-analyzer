import { Card, Stack, StackSeparator, Tabs, useDisclosure } from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TbMoodEmpty } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { ConfirmModal, TextPlaceholder } from '@/base';
import { type AnalysisSource, DeletableSentence, type TAnalysis } from '@/features/syntax-editor';
import {
  analysisListBySourceAtom,
  removeUserAnalysisActionAtom,
  selectedAnalysisAtom,
} from '@/features/syntax-editor/store';
import { getSyntaxEditorPath } from '@/routes';

type AnalysisInfo = { index: number; analysis: TAnalysis };

interface SentenceListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function SentenceList({ activeTab, onTabChange }: SentenceListProps) {
  const { t } = useTranslation();
  const tabs: { label: string; source: AnalysisSource }[] = [
    { label: t('editor.userSentences'), source: 'user' },
    { label: t('editor.sampleSentences'), source: 'sample' },
  ];
  const selectedAnalysis = useRef<AnalysisInfo | null>(null);
  const { open, onOpen, onClose } = useDisclosure();
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
      <Tabs.Root
        value={activeTab}
        onValueChange={({ value }) => onTabChange(value)}
        colorPalette="teal"
      >
        <Tabs.List aria-label={t('editor.sentenceList')}>
          {tabs.map(({ label, source }) => (
            <Tabs.Trigger value={source} key={source}>
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map(({ source }) => (
          <Tabs.Content value={source} pt={4} px={0} pb={0} key={source}>
            <Card.Root variant="outline" maxH={460} overflowY="auto">
              <Card.Body px={2.5} py={0.5}>
                <Stack
                  gap={0}
                  separator={<StackSeparator _dark={{ opacity: 0.8 }} />}
                  ref={source === 'user' ? parent : undefined}
                  overflowY="hidden"
                >
                  {!combinedAnalysisList[source].length && (
                    <TextPlaceholder
                      px={1.5}
                      py={3.5}
                      text={t('editor.noUserSentences')}
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
              </Card.Body>
            </Card.Root>
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <ConfirmModal
        isOpen={open}
        onClose={onClose}
        onConfirm={onSelectSentenceConfirm}
        headerContent={t('editor.chooseSentenceTitle')}
        bodyContent={t('editor.chooseSentenceConfirm')}
      />
    </Fragment>
  );
}
