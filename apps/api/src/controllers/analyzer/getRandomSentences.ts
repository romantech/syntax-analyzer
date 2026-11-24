import { ChatPromptTemplate } from '@langchain/core/prompts';
import { matchedData } from 'express-validator';
import type { AnalyzerDependencies } from '@/config/createServer';
import {
  ERROR_MESSAGES,
  type RandomSentenceParams,
  sentencesSchema,
} from '@/constants';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { validateClientIP } from '@/middlewares/validateClientIP';
import { RANDOM_SENTENCE_CONFIG } from '@/services/openAI/openAI';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis/redisKeys';
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
    const query = matchedData<RandomSentenceParams>(req);
    const { analyzer, analyzerQuota, analyzerRequests } = req.app.locals;
    const sentences = await analyzerRequests.run(res, (signal) =>
      analyzerQuota.withAnalyzerQuota(
        clientIP,
        FIELDS.RANDOM_SENTENCE,
        RANDOM_SENTENCE_COST,
        () => generateRandomSentences(analyzer, query, signal),
        signal,
      ),
    );

    res.status(200).json(sentences);
  }),
];

const generateRandomSentences = async (
  { redis, createModel, models }: AnalyzerDependencies,
  query: RandomSentenceParams,
  signal: AbortSignal,
) => {
  const template = await redis.hget(KEYS.PROMPT, FIELDS.RANDOM_SENTENCE);
  if (!template) return throwCustomError(RETRIEVE_FAILED('template'), 500);
  const prompt = await ChatPromptTemplate.fromTemplate(template).invoke({
    ...query,
  });
  signal.throwIfAborted();
  const llm = createModel({
    ...RANDOM_SENTENCE_CONFIG,
    model: models.fast,
  }).withStructuredOutput(sentencesSchema);

  const { sentences } = await llm.invoke(prompt, { signal });
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
