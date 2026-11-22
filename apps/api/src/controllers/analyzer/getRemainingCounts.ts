import { ERROR_MESSAGES } from '@/constants';
import { validateClientIP } from '@/middlewares/validateClientIP';
import { getAnalyzerRemainingCounts } from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';

const { IP_UNIDENTIFIABLE } = ERROR_MESSAGES;

export const getRemainingCounts = [
  validateClientIP,
  asyncHandler(async (req, res) => {
    const clientIP = req.clientIP ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    res.status(200).json(await getAnalyzerRemainingCounts(clientIP));
  }),
];
