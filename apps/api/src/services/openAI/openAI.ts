import type { ChatOpenAIFields } from '@langchain/openai';

export const RANDOM_SENTENCE_CONFIG = {
  reasoning: { effort: 'none' },
} satisfies ChatOpenAIFields;
