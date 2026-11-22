import { Box, Grid, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Notice } from '@/base';
import { FieldGroupHeader, RandomSentenceForm } from '@/features/syntax-analyzer';
import { AddSentenceForm, DEFAULT_SENTENCE_LIST_TAB, SentenceList } from '@/features/syntax-editor';

export default function SentenceManager() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(DEFAULT_SENTENCE_LIST_TAB);

  return (
    <Grid
      py={8}
      gap={8}
      alignItems="start"
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 650px) minmax(0, 768px)' }}
      templateRows={{ lg: 'auto 1fr' }}
      templateAreas={{ base: '"input" "list" "generator"', lg: '"input list" "generator list"' }}
    >
      <Stack gridArea="input">
        <Notice size="sm" borderRadius="md" p={1} text={t('editor.instructions')} />
        <AddSentenceForm onConfirmEffect={() => setActiveTab('user')} />
      </Stack>
      <Box gridArea="list" borderRadius="lg" borderWidth={1} p={{ base: 3, md: 4 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <SentenceList activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>
      </Box>
      <Box gridArea="generator" mt={{ base: 8, lg: 0 }}>
        <FieldGroupHeader>{t('generator.heading')}</FieldGroupHeader>
        <RandomSentenceForm />
      </Box>
    </Grid>
  );
}
