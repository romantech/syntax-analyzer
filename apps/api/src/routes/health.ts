import { type RequestHandler, Router } from 'express';
import type Redis from 'ioredis';
import requestIP from 'request-ip';

const REDIS_READINESS_TIMEOUT_MS = 1_000;
const healthRouter = Router();

healthRouter.get(['/', '/health'], (req, res, _next) => {
  const request_ip = requestIP.getClientIp(req);

  res.status(200).send({
    uptime: process.uptime(),
    message: 'Server is up and running',
    timestamp: Date.now(),
    status: 'OK',
    request_ip,
  });
});

export const createReadinessHandler = (
  redis: Pick<Redis, 'ping' | 'status'> | undefined,
): RequestHandler => {
  let pending: Promise<boolean> | undefined;

  const checkRedis = () => {
    if (redis?.status !== 'ready') return false;
    // Keep sharing the result until the command settles to avoid queuing PINGs during a stall.
    pending ??= new Promise<boolean>((resolve) => {
      const deadline = setTimeout(resolve, REDIS_READINESS_TIMEOUT_MS, false);
      void redis
        .ping()
        .then(
          (reply) => resolve(reply === 'PONG'),
          () => resolve(false),
        )
        .finally(() => {
          clearTimeout(deadline);
          pending = undefined;
        });
    });
    return pending;
  };

  return async (_req, res) => {
    const ready = await checkRedis();
    res.set('Cache-Control', 'no-store');
    if (!ready) res.locals.errorType = 'redis-not-ready';
    res
      .status(ready ? 200 : 503)
      .json({ status: ready ? 'OK' : 'UNAVAILABLE' });
  };
};

export { healthRouter };
