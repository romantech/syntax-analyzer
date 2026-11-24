import { randomUUID } from 'node:crypto';
import { logger } from '@/config/logger';
import { throwCustomError } from '@/utils/customError';
import { redis } from './redis';
import { ANALYZER_INIT_COUNTS, ANALYZER_KEY_EXP } from './redisDefaults';
import { ANALYZER_REDIS_SCHEMA } from './redisKeys';

const { FIELDS, KEYS } = ANALYZER_REDIS_SCHEMA;
const { REMAINING } = KEYS;
const { ANALYSIS, RANDOM_SENTENCE } = ANALYZER_INIT_COUNTS;
const PERIOD_FIELD = '__quota_period';
const QUOTA_ARGS = [
  PERIOD_FIELD,
  FIELDS.ANALYSIS,
  ANALYSIS.TOTAL,
  ANALYSIS.PER_USER,
  FIELDS.RANDOM_SENTENCE,
  RANDOM_SENTENCE.TOTAL,
  RANDOM_SENTENCE.PER_USER,
  ANALYZER_KEY_EXP,
] as const;

const QUOTA_SETUP = `
local total_key, user_key, reservation_key = unpack(KEYS)
local period_field, analysis_field, analysis_limit, user_analysis_limit,
  sentence_field, sentence_limit, user_sentence_limit, ttl, new_user_period,
  field, cost = unpack(ARGV)

local function ensure_total_quota()
  local seconds_per_day = 86400
  local kst_offset = 9 * 3600
  local now = tonumber(redis.call('TIME')[1])
  -- Keep the millisecond timestamp format used by the old scheduler.
  local midnight = (math.floor((now + kst_offset) / seconds_per_day) * seconds_per_day - kst_offset) * 1000
  local period = redis.call('HGET', total_key, period_field)
  local previous_midnight = tonumber(period)
  if not previous_midnight or previous_midnight < midnight then
    period = tostring(midnight)
    redis.call('HSET', total_key, period_field, period, analysis_field, analysis_limit, sentence_field, sentence_limit)
  end
  return period
end

local function ensure_user_quota()
  local period = redis.call('HGET', user_key, period_field)
  if period then
    return period
  end

  if redis.call('EXISTS', user_key) == 0 then
    redis.call('HSET', user_key, period_field, new_user_period,
      analysis_field, user_analysis_limit, sentence_field, user_sentence_limit)
    redis.call('EXPIRE', user_key, ttl)
  else
    -- Keys created by the old lookup may have balances and an expiry but no period.
    redis.call('HSET', user_key, period_field, new_user_period)
  end
  return new_user_period
end
`;

const RESERVE_QUOTA = `${QUOTA_SETUP}
cost = tonumber(cost)
local total_period = ensure_total_quota()

if redis.call('EXISTS', reservation_key) == 1 then
  return 1
end

local user_period = ensure_user_quota()
local total = tonumber(redis.call('HGET', total_key, field))
local user = tonumber(redis.call('HGET', user_key, field))
if not total or not user or total < cost or user < cost then
  return 0
end

redis.call('HSET', total_key, field, total - cost)
redis.call('HSET', user_key, field, user - cost)
redis.call('SET', reservation_key, cjson.encode({total_period, user_period}), 'EX', ttl)
return 1
`;

const REFUND_QUOTA = `
local total_key, user_key, reservation_key = unpack(KEYS)
local field, cost, period_field = unpack(ARGV)
local reservation = redis.call('GET', reservation_key)
if not reservation then
  return 0
end

local periods = cjson.decode(reservation)
local total = redis.call('HMGET', total_key, period_field, field)
local user = redis.call('HMGET', user_key, period_field, field)
if total[1] == periods[1] and tonumber(total[2]) then
  redis.call('HSET', total_key, field, tonumber(total[2]) + tonumber(cost))
end
if user[1] == periods[2] and tonumber(user[2]) then
  redis.call('HSET', user_key, field, tonumber(user[2]) + tonumber(cost))
end
return redis.call('DEL', reservation_key)
`;

const READ_QUOTA = `${QUOTA_SETUP}
ensure_total_quota()
local total = redis.call('HMGET', total_key, analysis_field, sentence_field)

if total[1] and total[2] then
  ensure_user_quota()
end

local user = redis.call('HMGET', user_key, analysis_field, sentence_field)
return {total[1], total[2], user[1], user[2]}
`;

export const withAnalyzerQuota = async <Result>(
  clientIP: string,
  field: (typeof FIELDS)[keyof typeof FIELDS],
  cost: number,
  run: () => Promise<Result>,
): Promise<Result> => {
  const id = randomUUID();
  const keys = [
    REMAINING.TOTAL,
    REMAINING.USER(clientIP),
    REMAINING.RESERVATION(id),
  ];

  try {
    // Keep the reservation until it expires so a replay cannot debit twice.
    const reserved = await redis.eval(
      RESERVE_QUOTA,
      keys.length,
      ...keys,
      ...QUOTA_ARGS,
      id,
      field,
      cost,
    );

    if (reserved === 1) return await run();
  } catch (error) {
    // A lost Redis reply can leave a reservation even if the client saw an error.
    try {
      await redis.eval(
        REFUND_QUOTA,
        keys.length,
        ...keys,
        field,
        cost,
        PERIOD_FIELD,
      );
    } catch {
      logger.error('Failed to refund analyzer quota.');
    }
    throw error;
  }

  return throwCustomError('No remaining request count available.', 400);
};

export const getAnalyzerRemainingCounts = async (clientIP: string) => {
  const [totalAnalysis, totalSentences, userAnalysis, userSentences] =
    (await redis.eval(
      READ_QUOTA,
      2,
      REMAINING.TOTAL,
      REMAINING.USER(clientIP),
      ...QUOTA_ARGS,
      randomUUID(),
    )) as (string | null)[];

  const missingFields = [
    totalAnalysis === null && FIELDS.ANALYSIS,
    totalSentences === null && FIELDS.RANDOM_SENTENCE,
  ].filter(Boolean);
  if (missingFields.length) {
    throwCustomError(
      `Invalid counts for key: ${REMAINING.TOTAL}. Missing fields: ${missingFields.join(', ')}.`,
    );
  }

  return {
    analysis: Math.min(Number(totalAnalysis), Number(userAnalysis)),
    random_sentence: Math.min(Number(totalSentences), Number(userSentences)),
  };
};
