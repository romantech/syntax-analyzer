import type { ChatOpenAIFields } from '@langchain/openai';

export const RANDOM_SENTENCE_CONFIG = {
  temperature: 1,
  reasoning: { effort: 'low' },
} satisfies ChatOpenAIFields;
