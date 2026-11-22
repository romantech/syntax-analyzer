import type { RequestHandler } from 'express';
import requestIP from 'request-ip';
import { ERROR_MESSAGES } from '@/constants';
import { throwCustomError } from '@/utils';

export const validateClientIP: RequestHandler = (req, _res, next) => {
  const IP = requestIP.getClientIp(req);
  if (!IP) return throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);

  req.clientIP = IP;
  next();
};
