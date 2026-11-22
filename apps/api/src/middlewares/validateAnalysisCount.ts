import { ERROR_MESSAGES } from '@/constants';
import { validateClientIP } from '@/middlewares/validateClientIP';
import { ANALYZER_REDIS_SCHEMA, redis } from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';

const {
  KEYS: { REMAINING },
  FIELDS: { ANALYSIS, RANDOM_SENTENCE },
} = ANALYZER_REDIS_SCHEMA;
const { IP_UNIDENTIFIABLE } = ERROR_MESSAGES;
const RANDOM_SENTENCES_PATH = '/random-sentences';

/* 미들웨어에서 발생한 비동기 에러는 Express 에러 핸들러로 전달 안돼서 asyncHandler 함수로 랩핑 */
export const validateAnalysisCount = [
  validateClientIP,
  asyncHandler(async (req, _res, next) => {
    const clientIP = req.clientIP ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    const fieldName = getFieldName(req.path);

    const rawTotal = await redis.hget(REMAINING.TOTAL, fieldName);
    const rawUserTotal = await redis.hget(REMAINING.USER(clientIP), fieldName);

    const total = Number(rawTotal);
    const userTotal = Number(rawUserTotal);

    if (total <= 0 || userTotal <= 0) {
      throwCustomError('No remaining request count available.', 400);
    }

    next(); // 모든 체크 성공
  }),
];

const getFieldName = (pathname: string) => {
  switch (pathname) {
    case RANDOM_SENTENCES_PATH:
      return RANDOM_SENTENCE;
    default:
      return ANALYSIS;
  }
};
