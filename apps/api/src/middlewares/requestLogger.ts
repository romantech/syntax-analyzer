import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { logger } from '@/config/logger';

// Requests that fail before routing still need safe path labels.
const loggedPaths = new Set([
  '/',
  '/analyzer',
  '/analyzer/random-sentences',
  '/analyzer/remaining-counts',
  '/favicon.ico',
  '/health',
  '/ready',
  '/robots.txt',
]);

export const requestLogger: RequestHandler = (req, res, next) => {
  const requestId = randomUUID();
  const startedAt = performance.now();
  const path = req.path.toLowerCase().replace(/\/$/, '') || '/';
  res.setHeader('X-Request-Id', requestId);

  res.once('close', () => {
    const status = res.headersSent ? res.statusCode : null;
    const aborted = !res.writableFinished;
    const level =
      status !== null && status >= 500
        ? 'error'
        : aborted || (status !== null && status >= 400)
          ? 'warn'
          : 'info';
    const errorType =
      res.locals.errorType ?? (aborted ? 'connection-closed' : undefined);

    logger.log(level, 'HTTP request', {
      requestId,
      method: req.method,
      path: loggedPaths.has(path) ? path : '<unmatched>',
      status,
      durationMs: Math.round(performance.now() - startedAt),
      errorType,
    });
  });

  next();
};
