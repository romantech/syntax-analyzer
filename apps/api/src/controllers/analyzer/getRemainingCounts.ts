import { ERROR_MESSAGES } from '@/constants';
import { identifyAnalyzerClient } from '@/middlewares/identifyAnalyzerClient';
import { asyncHandler, throwCustomError } from '@/utils';

const { IP_UNIDENTIFIABLE } = ERROR_MESSAGES;

export const getRemainingCounts = [
  identifyAnalyzerClient,
  asyncHandler(async (req, res) => {
    const client =
      req.analyzerClient ?? throwCustomError(IP_UNIDENTIFIABLE, 400);
    const { analyzerQuota } = req.app.locals;
    res
      .status(200)
      .json(await analyzerQuota.getAnalyzerRemainingCounts(client));
  }),
];
