import { scheduleRedisReset } from '@/schedulers/resetRedisScheduler';

const initSchedulers = () => {
  scheduleRedisReset();
};

export { initSchedulers };
