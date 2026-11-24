import Redis from 'ioredis';
import type { Environment } from '@/config/environment';
import { logger } from '@/config/logger';

export const createRedis = ({ redis: options, isProd }: Environment) => {
  const redis = new Redis({
    ...options,
    protocol: 2,
    connectionName: `project-server-${isProd ? 'prod' : 'dev'}`,
  });

  redis.on('connect', () => {
    logger.info('Successfully connected to Redis');
  });

  redis.on('ready', () => {
    logger.info('Redis is ready for use');
  });

  redis.on('error', () => {
    logger.error('Error connecting to Redis.');
  });

  return redis;
};
