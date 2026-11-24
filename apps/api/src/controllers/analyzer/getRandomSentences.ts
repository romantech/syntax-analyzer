import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { matchedData } from 'express-validator';
import {
  ERROR_MESSAGES,
  type RandomSentenceParams,
  sentencesSchema,
} from '@/constants';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { validateClientIP } from '@/middlewares/validateClientIP';
import {
  ANALYZER_REDIS_SCHEMA,
  RANDOM_SENTENCE_CONFIG,
  redis,
  withAnalyzerQuota,
} from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';
import {
  checkMaxCharField,
  checkSentenceCountField,
  checkTopicsField,
} from '@/validators';

const { IP_UNIDENTIFIABLE, RETRIEVE_FAILED } = ERROR_MESSAGES;
const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;
const RANDOM_SENTENCE_COST = 1;

export const getRandomSentences = [
  checkMaxCharField,
  checkTopicsField,
  checkSentenceCountField,
  handleValidationErrors,
  validateClientIP,
  asyncHandler(async (req, res) => {
    const clientIP = req.clientIP ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    const sentences = await withAnalyzerQuota(
      clientIP,
      FIELDS.RANDOM_SENTENCE,
      RANDOM_SENTENCE_COST,
      () => generateRandomSentences(matchedData<RandomSentenceParams>(req)),
    );

    res.status(200).json(sentences);
  }),
];

const retrieveRandomSentencePrompt = async (query: RandomSentenceParams) => {
  const template = await redis.hget(KEYS.PROMPT, FIELDS.RANDOM_SENTENCE);
  if (!template) return throwCustomError(RETRIEVE_FAILED('template'), 500);

  const prompt = ChatPromptTemplate.fromTemplate(template);
  return await prompt.invoke({ ...query, topics: query.topics });
};

const generateRandomSentences = async (query: RandomSentenceParams) => {
  const prompt = await retrieveRandomSentencePrompt(query);
  const llm = new ChatOpenAI(RANDOM_SENTENCE_CONFIG).withStructuredOutput(
    sentencesSchema,
  );

  const { sentences } = await llm.invoke(prompt);
  if (
    sentences.length !== query.sent_count ||
    sentences.some(
      (sentence) => sentence.trim() === '' || sentence.length > query.max_chars,
    )
  ) {
    return throwCustomError(
      'Invalid generated sentences.',
      502,
      'invalid-model-output',
    );
  }

  return sentences;
};
