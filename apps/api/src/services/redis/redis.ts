import Redis from 'ioredis';
import { envConfig, logger } from '@/config';

export const redis = new Redis({
  protocol: 2,
  host: envConfig.redis.host,
  port: envConfig.redis.port,
  username: envConfig.redis.username,
  password: envConfig.redis.password,
});

redis.on('connect', () => {
  const suffix = envConfig.isProd ? 'prod' : 'dev';
  redis.client('SETNAME', `project-server-${suffix}`);
  logger.info('Successfully connected to Redis');
});

redis.on('ready', () => {
  logger.info('Redis is ready for use');
});

redis.on('error', (error) => {
  logger.error('Error connecting to Redis:', error);
});
