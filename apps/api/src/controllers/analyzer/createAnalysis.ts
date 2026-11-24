import type { AnalyzerDependencies } from '@/config/createServer';
import { ERROR_MESSAGES } from '@/constants';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { identifyAnalyzerClient } from '@/middlewares/identifyAnalyzerClient';
import { generateStructuredAnalysis } from '@/services/openAI/structuredAnalysis';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis/redisKeys';
import { asyncHandler, throwCustomError } from '@/utils';
import { checkModelField, checkSentenceField } from '@/validators';

const { KEYS, FIELDS, PROMPT_FIELDS } = ANALYZER_REDIS_SCHEMA;

export const createAnalysis = [
  checkSentenceField,
  checkModelField,
  handleValidationErrors,
  identifyAnalyzerClient,
  asyncHandler(async (req, res) => {
    const client =
      req.analyzerClient ??
      throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);
    const { sentence } = req.body as { sentence: string[] };
    const { analyzer, analyzerQuota, analyzerRequests } = req.app.locals;

    const analysis = await analyzerRequests.run(res, (signal) =>
      analyzerQuota.withAnalyzerQuota(
        client,
        FIELDS.ANALYSIS,
        1,
        () => analyzeSentence(analyzer, sentence, signal),
        signal,
      ),
    );

    res.status(200).json(analysis);
  }),
];

const analyzeSentence = async (
  { redis, createModel, models }: AnalyzerDependencies,
  sentence: string[],
  signal: AbortSignal,
) => {
  const [initial, retryInstruction] = await redis.hmget(
    KEYS.PROMPT,
    PROMPT_FIELDS.STRUCTURED_ANALYSIS,
    PROMPT_FIELDS.STRUCTURED_ANALYSIS_RETRY,
  );
  signal.throwIfAborted();
  if (!initial?.trim() || !retryInstruction?.trim()) {
    return throwCustomError(
      ERROR_MESSAGES.RETRIEVE_FAILED('analysis prompts'),
      500,
    );
  }

  return generateStructuredAnalysis(
    createModel,
    models.analysis,
    sentence,
    { initial, retryInstruction },
    signal,
  );
};
