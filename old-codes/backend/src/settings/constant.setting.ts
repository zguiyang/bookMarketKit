// jwt constants key
export const jwtConstants = {
  JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET',
  WT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
};

export const redisConstants = {
  EMAIL_CODE_PREFIX: 'email:code:',
  EMAIL_RATE_LIMIT_PREFIX: 'email:rate:',
} as const;

export const queueMessageConstants = {
  EMAIL_VERIFICATION_QUEUE: 'email:verification:queue',
};
