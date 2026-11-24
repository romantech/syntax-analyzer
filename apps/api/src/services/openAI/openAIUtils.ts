import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI, type ChatOpenAIFields } from '@langchain/openai';
import { jsonrepair } from 'jsonrepair';
import { AI_MODEL, AIModelKey } from '@/services';
import { throwCustomError } from '@/utils/customError';

export const jsonOutputParser = new JsonOutputParser();

export const createChatOpenAI = (config: ChatOpenAIFields) => {
  return new ChatOpenAI({
    ...config,
    // The OpenAI SDK also observes the request signal during retry backoff.
    maxRetries: 0,
    configuration: { ...config.configuration, maxRetries: 2, logLevel: 'off' },
  });
};

export const createJSONChatOpenAI = (config: ChatOpenAIFields) => {
  return createChatOpenAI({
    ...config,
    modelKwargs: { response_format: { type: 'json_object' } },
  });
};

type JSONRepairStrategy = (
  json: string,
  signal: AbortSignal,
) => Promise<unknown>;

const strategies: JSONRepairStrategy[] = [
  async (json) => JSON.parse(json),
  async (json) => JSON.parse(jsonrepair(json)),
  async (json, signal) => {
    const jsonOutputLLM = createJSONChatOpenAI({
      temperature: 0,
      model: AI_MODEL[AIModelKey.FAST],
      reasoning: { effort: 'minimal' },
    });

    const prompt = [
      'You are a JSON repair assistant.',
      'Fix the given invalid JSON string.',
      'Return only valid JSON with no markdown or extra explanation.',
      '',
      `Format instructions:\n${jsonOutputParser.getFormatInstructions()}`,
      '',
      `Invalid JSON:\n${json}`,
    ].join('\n');

    const response = await jsonOutputLLM.invoke(prompt, { signal });
    return await jsonOutputParser.parse(response.text);
  },
];

export const validateAndRepairJSON = async (
  jsonString: string,
  signal: AbortSignal,
) => {
  for (const strategy of strategies) {
    signal.throwIfAborted();
    try {
      return await strategy(jsonString, signal);
    } catch {
      signal.throwIfAborted();
      // Parser and provider errors can contain the original model output.
    }
  }

  throwCustomError(
    'Failed to parse and repair JSON with all available methods.',
    500,
    'model-json-repair-failed',
  );
};
