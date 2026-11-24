import { ReplyError } from 'ioredis';
import { createServer, envConfig, logger } from '@/config';
import { errorHandler, notFoundHandler } from '@/middlewares';
import { setupRoutes } from '@/routes';
import { redis } from '@/services';
import { checkEnvVariables } from '@/utils';

const REDIS_STARTUP_TIMEOUT_MS = 10_000;

/**
 * 배포 환경에선 빌드(ts -> js 파일로 트랜스파일) 후 모든 js 파일이 dist 폴더에 저장됨
 * node -r module-alias/register 명령어는 module-alias/register 모듈을 실행하고,
 * package.json._moduleAliases 속성을 참조해 @ 경로를 dist 폴더로 매핑함.
 * 즉, 모든 import 구문의 @ 경로는 dist 폴더로 변환됨 e.g. @/config -> dist/config
 * src/config 경로로 작성하면 dist 폴더에서 모듈을 찾는게 아니어서 에러 발생하므로 주의
 * */
const initServer = async () => {
  checkEnvVariables();

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

  const app = createServer();
  app.locals.redis = redis;
  setupRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(envConfig.port, (error) => {
    if (error) throw error;
    logger.info(`Server is running on port ${envConfig.port}`);
  });
};

(async () => initServer())();
