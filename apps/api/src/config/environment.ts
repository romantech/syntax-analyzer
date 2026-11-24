const MODEL_ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/;

export const loadEnvironment = (env: NodeJS.ProcessEnv) => {
  const invalid = new Set<string>();
  const required = (name: string, format?: RegExp) => {
    const value = env[name]?.trim();
    if (!value || (format && !format.test(value))) invalid.add(name);
    return value ?? '';
  };
  const port = (name: string, fallback?: number, min = 1) => {
    const value = env[name]?.trim();
    if (!value && fallback !== undefined) return fallback;
    const number = Number(value);
    if (!value || !/^\d+$/.test(value) || number < min || number > 65_535) {
      invalid.add(name);
    }
    return number;
  };

  const mode = required('NODE_ENV', /^(development|production|test)$/);
  const isProd = mode === 'production';
  const config = {
    isProd,
    isKoyeb: Boolean(env.KOYEB_APP_ID),
    port: port('PORT', isProd ? undefined : 3001, mode === 'test' ? 0 : 1),
    corsOrigins:
      env.CORS_ORIGIN?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) ?? [],
    openAIKey: required('OPENAI_API_KEY'),
    redis: {
      host: env.REDIS_HOST?.trim() || 'localhost',
      port: port('REDIS_PORT', 6379),
      username: env.REDIS_USERNAME || undefined,
      password: env.REDIS_PASSWORD || undefined,
    },
    models: {
      fast: required('MODEL_FAST', MODEL_ID),
      primary: required('MODEL_PRIMARY', MODEL_ID),
      'fast-ft': required('MODEL_FAST_FT', MODEL_ID),
      'primary-ft': required('MODEL_PRIMARY_FT', MODEL_ID),
    },
  };

  if (invalid.size) {
    throw new Error(
      `Missing or invalid environment variables: ${[...invalid].join(', ')}`,
    );
  }
  return config;
};

export type Environment = ReturnType<typeof loadEnvironment>;
