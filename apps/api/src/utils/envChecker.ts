import { env, exit } from 'node:process';
import { logger, RequiredEnv } from '@/config';

export const checkEnvVariables = () => {
  const missingVars = Object.values(RequiredEnv)
    .filter((variable) => !env[variable])
    .join(', ');

  if (missingVars) {
    logger.error(`Environment variable(s) ${missingVars} are missing!`);
    exit(1); // 프로세스 종료
  }
};
