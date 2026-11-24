import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import type { RequestHandler } from 'express';
import { ERROR_MESSAGES } from '@/constants';
import { throwCustomError } from '@/utils';

export const ANALYZER_BROWSER_HEADER = 'X-Analyzer-Browser';
const COOKIE_NAME = 'analyzer_browser';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const BROWSER_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export const identifyAnalyzerClient: RequestHandler = (req, res, next) => {
  const { isKoyeb, cloudflarePeers, analyzerCookie } = req.app.locals;
  // Koyeb's public HTTP edge only vouches for the last forwarded address.
  let ip = isKoyeb
    ? req.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    : req.socket.remoteAddress;
  if (!ip || !isIP(ip)) {
    return throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);
  }

  if (isKoyeb && cloudflarePeers?.check(ip, isIP(ip) === 6 ? 'ipv6' : 'ipv4')) {
    ip = req.get('cf-connecting-ip');
  }
  if (!ip || !isIP(ip)) {
    return throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);
  }

  res.set('Cache-Control', 'private, no-store');
  req.analyzerClient = { ip };
  if (analyzerCookie && req.get(ANALYZER_BROWSER_HEADER) === '1') {
    const cookieName = analyzerCookie.secure
      ? `__Host-${COOKIE_NAME}`
      : COOKIE_NAME;
    const signedId: unknown = req.signedCookies[cookieName];
    if (typeof signedId === 'string' && BROWSER_ID.test(signedId)) {
      req.analyzerClient.browserId = signedId;
    } else {
      const browserId = randomUUID();
      req.analyzerClient.browserId = browserId;
      res.cookie(cookieName, browserId, {
        ...analyzerCookie,
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
      });
    }
  }
  next();
};
