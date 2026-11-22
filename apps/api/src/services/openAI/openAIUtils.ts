import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI, type ChatOpenAIFields } from '@langchain/openai';
import { jsonrepair } from 'jsonrepair';
import { logger } from '@/config';
import { AI_MODEL, AIModelKey } from '@/services';
import { throwCustomError } from '@/utils/customError';

export const jsonOutputParser = new JsonOutputParser();

export const createJSONChatOpenAI = (config: ChatOpenAIFields) => {
  return new ChatOpenAI({
    ...config,
    modelKwargs: { response_format: { type: 'json_object' } },
  });
};

interface RepairStrategy {
  name: string;
  execute: (jsonString: string) => Promise<unknown>;
}

const strategies: RepairStrategy[] = [
  {
    name: 'Basic JSON.parse',
    execute: async (json) => JSON.parse(json),
  },
  {
    name: 'jsonrepair',
    execute: async (json) => {
      const repaired = jsonrepair(json);
      return JSON.parse(repaired);
    },
  },
  {
    name: 'LLM Repair',
    execute: async (json) => {
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

      const response = await jsonOutputLLM.invoke(prompt);
      return await jsonOutputParser.parse(response.text);
    },
  },
];

export const validateAndRepairJSON = async (jsonString: string) => {
  for (const strategy of strategies) {
    try {
      logger.info(`Trying ${strategy.name}`);
      const result = await strategy.execute(jsonString);
      logger.info(`${strategy.name} succeeded`);
      return result;
    } catch (error) {
      logger.warn(`${strategy.name} failed: ${error}`);
    }
  }

  logger.error('All JSON repair strategies failed');
  throwCustomError(
    'Failed to parse and repair JSON with all available methods.',
    500,
  );
};
