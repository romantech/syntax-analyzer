import type Redis from 'ioredis';
import { ANALYZER_INIT_COUNTS } from './redisDefaults';
import { ANALYZER_REDIS_SCHEMA } from './redisKeys';

export const initRedisKeys = async (redis: Redis) => {
  const { ANALYSIS, RANDOM_SENTENCE } = ANALYZER_INIT_COUNTS;
  const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;

  await Promise.all([
    redis.hsetnx(KEYS.REMAINING.TOTAL, FIELDS.ANALYSIS, ANALYSIS.TOTAL),
    redis.hsetnx(
      KEYS.REMAINING.TOTAL,
      FIELDS.RANDOM_SENTENCE,
      RANDOM_SENTENCE.TOTAL,
    ),
  ]);
};
