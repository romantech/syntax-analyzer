import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { AnalyzerDependencies } from '@/config/createServer';
import { ANALYSIS_DECREMENT_COUNT, ERROR_MESSAGES } from '@/constants';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { identifyAnalyzerClient } from '@/middlewares/identifyAnalyzerClient';
import {
  ANALYSIS_MODEL_OPTION,
  type AnalysisModel,
  createJSONChatOpenAI,
  validateAndRepairJSON,
} from '@/services/openAI';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis/redisKeys';
import { asyncHandler, throwCustomError } from '@/utils';
import { checkModelField, checkSentenceField } from '@/validators';

interface RequestBody {
  sentence: string[];
  model: AnalysisModel;
}

const { IP_UNIDENTIFIABLE, RETRIEVE_FAILED } = ERROR_MESSAGES;
const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;

export const createAnalysis = [
  checkSentenceField,
  checkModelField,
  handleValidationErrors,
  identifyAnalyzerClient,
  asyncHandler(async (req, res) => {
    const client =
      req.analyzerClient ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    const { sentence, model }: RequestBody = req.body;
    const { analyzer, analyzerQuota, analyzerRequests } = req.app.locals;

    const analysis = await analyzerRequests.run(res, (signal) =>
      analyzerQuota.withAnalyzerQuota(
        client,
        FIELDS.ANALYSIS,
        ANALYSIS_DECREMENT_COUNT[model],
        () =>
          executeAnalysis(analyzer, JSON.stringify(sentence), model, signal),
        signal,
      ),
    );

    res.status(200).json(analysis);
  }),
];

const executeAnalysis = async (
  { redis, createModel, models }: AnalyzerDependencies,
  sentence: string,
  modelKey: AnalysisModel,
  signal: AbortSignal,
) => {
  const { temperature, promptField } = ANALYSIS_MODEL_OPTION[modelKey];
  const prompt = await redis.hget(KEYS.PROMPT, promptField);
  if (!prompt) return throwCustomError(RETRIEVE_FAILED('prompt'), 500);
  signal.throwIfAborted();
  const messages = [new SystemMessage(prompt), new HumanMessage(sentence)];

  const llm = createJSONChatOpenAI(createModel, {
    model: models[modelKey],
    temperature,
  });

  // StringOutputParser를 LLM에 연결하여 새로운 체인 생성
  // StringOutputParser는 LLM 응답에서 content 속성만 추출하여 문자열(string)로 반환
  const chain = llm.pipe(new StringOutputParser());
  // invoke 결과는 AIMessage 객체 대신 문자열 content 바로 반환
  const stringContent = await chain.invoke(messages, { signal });

  return await validateAndRepairJSON(
    stringContent,
    signal,
    createModel,
    models.fast,
  );
};
