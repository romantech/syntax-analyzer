import { ERROR_MESSAGES } from '@/constants';
import { validateClientIP } from '@/middlewares/validateClientIP';
import { asyncHandler, throwCustomError } from '@/utils';

const { IP_UNIDENTIFIABLE } = ERROR_MESSAGES;

export const getRemainingCounts = [
  validateClientIP,
  asyncHandler(async (req, res) => {
    const clientIP = req.clientIP ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    const { analyzerQuota } = req.app.locals;
    res
      .status(200)
      .json(await analyzerQuota.getAnalyzerRemainingCounts(clientIP));
  }),
];
