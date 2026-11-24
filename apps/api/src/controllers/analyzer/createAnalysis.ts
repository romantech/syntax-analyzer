import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ANALYSIS_DECREMENT_COUNT, ERROR_MESSAGES } from '@/constants';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { validateClientIP } from '@/middlewares/validateClientIP';
import {
  ANALYSIS_MODEL_OPTION,
  ANALYZER_REDIS_SCHEMA,
  type AnalysisModel,
  createJSONChatOpenAI,
  redis,
  validateAndRepairJSON,
  withAnalyzerQuota,
} from '@/services';
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
  validateClientIP,
  asyncHandler(async (req, res) => {
    const clientIP = req.clientIP ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    const { sentence, model }: RequestBody = req.body;

    const analysis = await req.app.locals.analyzerRequests.run(res, (signal) =>
      withAnalyzerQuota(
        clientIP,
        FIELDS.ANALYSIS,
        ANALYSIS_DECREMENT_COUNT[model],
        () => executeAnalysis(JSON.stringify(sentence), model, signal),
        signal,
      ),
    );

    res.status(200).json(analysis);
  }),
];

const retrieveAnalysisPrompt = async (model: AnalysisModel) => {
  const { promptField } = ANALYSIS_MODEL_OPTION[model];
  const prompt = await redis.hget(KEYS.PROMPT, promptField);

  if (!prompt) return throwCustomError(RETRIEVE_FAILED('prompt'), 500);

  return prompt;
};

const executeAnalysis = async (
  sentence: string,
  modelKey: AnalysisModel,
  signal: AbortSignal,
) => {
  const { temperature, model } = ANALYSIS_MODEL_OPTION[modelKey];
  const prompt = await retrieveAnalysisPrompt(modelKey);
  signal.throwIfAborted();
  const messages = [new SystemMessage(prompt), new HumanMessage(sentence)];

  const llm = createJSONChatOpenAI({ model, temperature });

  // StringOutputParser를 LLM에 연결하여 새로운 체인 생성
  // StringOutputParser는 LLM 응답에서 content 속성만 추출하여 문자열(string)로 반환
  const chain = llm.pipe(new StringOutputParser());
  // invoke 결과는 AIMessage 객체 대신 문자열 content 바로 반환
  const stringContent = await chain.invoke(messages, { signal });

  return await validateAndRepairJSON(stringContent, signal);
};
