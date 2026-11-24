import type { Application } from 'express';
import type Redis from 'ioredis';
import { ignoreFavicon } from '@/middlewares';
import { robotsRouter } from '@/routes/robots';
import { analyzerRouter } from './analyzer';
import { createReadinessHandler, healthRouter } from './health';

export const setupRoutes = (
  app: Application,
  redis: Pick<Redis, 'ping' | 'status'>,
) => {
  app.use(ignoreFavicon);
  app.use(robotsRouter);
  app.use('/', healthRouter);
  app.get('/ready', createReadinessHandler(redis));
  app.use('/analyzer', analyzerRouter);
};
