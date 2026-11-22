import { ERROR_MESSAGES } from '@/constants';
import { validateClientIP } from '@/middlewares/validateClientIP';
import {
  ANALYZER_REDIS_SCHEMA,
  type AnalyzerFieldType,
  redis,
} from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';

const { REMAINING } = ANALYZER_REDIS_SCHEMA.KEYS;
const { IP_UNIDENTIFIABLE } = ERROR_MESSAGES;

/* 미들웨어에서 발생한 비동기 에러는 Express 에러 핸들러로 전달 안돼서 asyncHandler 함수로 랩핑 */
export const validateAnalysisCount = <Body>(
  fieldName: keyof AnalyzerFieldType,
  getCost: (body: Body) => number,
) => [
  validateClientIP,
  asyncHandler(async (req, _res, next) => {
    const clientIP = req.clientIP ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    const cost = getCost(req.body);

    const rawTotal = await redis.hget(REMAINING.TOTAL, fieldName);
    const rawUserTotal = await redis.hget(REMAINING.USER(clientIP), fieldName);

    const total = Number(rawTotal);
    const userTotal = Number(rawUserTotal);

    if (!(total >= cost && userTotal >= cost)) {
      throwCustomError('No remaining request count available.', 400);
    }

    next(); // 모든 체크 성공
  }),
];
