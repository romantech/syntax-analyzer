import { env } from 'node:process';

// Required Environment Variables
export enum RequiredEnv {
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  OPENAI_API_KEY = 'OPENAI_API_KEY',
}

// Optional Environment Variables
export enum OptionalEnv {
  CORS_ORIGIN = 'CORS_ORIGIN',

  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_USERNAME = 'REDIS_USERNAME',

  MODEL_FAST = 'MODEL_FAST',
  MODEL_PRIMARY = 'MODEL_PRIMARY',
  MODEL_FAST_FT = 'MODEL_FAST_FT',
  MODEL_PRIMARY_FT = 'MODEL_PRIMARY_FT',
}

const loadEnvironment = () => {
  const isProd = env[RequiredEnv.NODE_ENV] === 'production';
  const DEFAULT_SERVER_PORT = 3001;

  return {
    isProd,
    port: isProd ? Number(env[RequiredEnv.PORT]) : DEFAULT_SERVER_PORT,
    corsOrigins: env[OptionalEnv.CORS_ORIGIN]?.split(',') ?? [],
    openAIKey: env[RequiredEnv.OPENAI_API_KEY],
    redis: {
      host: env[OptionalEnv.REDIS_HOST],
      port: Number(env[OptionalEnv.REDIS_PORT]),
      password: env[OptionalEnv.REDIS_PASSWORD],
      username: env[OptionalEnv.REDIS_USERNAME],
    },
    models: {
      FAST: env[OptionalEnv.MODEL_FAST],
      PRIMARY: env[OptionalEnv.MODEL_PRIMARY],
      FAST_FT: env[OptionalEnv.MODEL_FAST_FT],
      PRIMARY_FT: env[OptionalEnv.MODEL_PRIMARY_FT],
    },
  } as const;
};

export const envConfig = loadEnvironment();
