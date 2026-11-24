import { ChatOpenAI, type ChatOpenAIFields } from '@langchain/openai';

export type CreateChatModel = (config: ChatOpenAIFields) => ChatOpenAI;

export const createChatOpenAI =
  (apiKey: string): CreateChatModel =>
  (config) => {
    return new ChatOpenAI({
      ...config,
      apiKey,
      // The OpenAI SDK also observes the request signal during retry backoff.
      maxRetries: 0,
      configuration: {
        ...config.configuration,
        maxRetries: 2,
        logLevel: 'off',
      },
    });
  };
