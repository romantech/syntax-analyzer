import type { Application } from 'express';
import { ignoreFavicon } from '@/middlewares';
import { robotsRouter } from '@/routes/robots';
import { analyzerRouter } from './analyzer';
import { createReadinessHandler, healthRouter } from './health';

export const setupRoutes = (app: Application) => {
  app.use(ignoreFavicon);
  app.use(robotsRouter);
  app.use('/', healthRouter);
  app.get('/ready', createReadinessHandler(app.locals.redis));
  app.use('/analyzer', analyzerRouter);
};
