import type { Server } from 'node:http';
import { type Redis, ReplyError } from 'ioredis';
import { AnalyzerRequests } from '@/services/analyzerRequests';
import { createChatOpenAI } from '@/services/openAI/openAIUtils';
import { createRedis } from '@/services/redis/redis';
import { createServer } from './createServer';
import type { Environment } from './environment';
import { logger } from './logger';

const REDIS_STARTUP_TIMEOUT_MS = 10_000;
const SHUTDOWN_DRAIN_MS = 20_000;
const SHUTDOWN_TIMEOUT_MS = 25_000;

const registerShutdown = (
  server: Server,
  requests: AnalyzerRequests,
  redis: Redis,
) => {
  const shutdown = async () => {
    if (!requests.accepting) return;
    requests.stopAccepting();
    logger.info('Server is shutting down.');

    const httpClosed = new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    const drain = setTimeout(() => requests.cancelPending(), SHUTDOWN_DRAIN_MS);
    const deadline = setTimeout(() => {
      logger.error('Timed out waiting for server shutdown.');
      server.closeAllConnections();
      redis.disconnect();
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    await Promise.all([httpClosed, requests.waitForPending()]);
    clearTimeout(drain);
    clearTimeout(deadline);
    redis.disconnect();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

export const startServer = async (
  config: Environment,
  redis = createRedis(config),
) => {
  const timeoutError = new Error('Redis PING timed out during startup');
  let startupTimeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      redis.ping(),
      new Promise<never>((_, reject) => {
        startupTimeout = setTimeout(() => {
          reject(timeoutError);
        }, REDIS_STARTUP_TIMEOUT_MS);
      }),
    ]);
  } catch (err) {
    const errorType =
      err === timeoutError
        ? 'redis-startup-timeout'
        : err instanceof ReplyError
          ? 'redis-reply-error'
          : 'redis-startup-error';
    logger.error('Failed to check the Redis connection.', { errorType });
    redis.disconnect();
    process.exitCode = 1;
    return;
  } finally {
    clearTimeout(startupTimeout);
  }

  const analyzerRequests = new AnalyzerRequests();
  const app = createServer({
    corsOrigins: config.corsOrigins,
    isKoyeb: config.isKoyeb,
    isProd: config.isProd,
    analyzerCookieSecret: config.analyzerCookieSecret,
    cloudflarePeers: config.cloudflarePeers,
    models: config.models,
    redis,
    createModel: createChatOpenAI(config.openAIKey),
    analyzerRequests,
  });
  const server = app.listen(config.port, (error) => {
    if (error) throw error;
    const address = server.address();
    const port = typeof address === 'object' ? address?.port : address;
    logger.info(`Server is running on port ${port}`);
  });
  registerShutdown(server, analyzerRequests, redis);
};
