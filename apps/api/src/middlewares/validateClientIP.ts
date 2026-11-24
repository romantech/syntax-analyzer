import { isIP } from 'node:net';
import type { RequestHandler } from 'express';
import { ERROR_MESSAGES } from '@/constants';
import { throwCustomError } from '@/utils';

export const validateClientIP: RequestHandler = (req, _res, next) => {
  // Koyeb's public HTTP edge only vouches for the last forwarded address.
  const ip = req.app.locals.isKoyeb
    ? req.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    : req.socket.remoteAddress;
  if (!ip || !isIP(ip)) {
    return throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);
  }

  req.clientIP = ip;
  next();
};
