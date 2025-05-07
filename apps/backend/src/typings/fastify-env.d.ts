import { FastifyInstance as OriginalFastifyInstance } from 'fastify';
declare module 'fastify' {
  interface FastifyInstance {
    config: {
      // this should be the same as the confKey in options
      DATABASE_URI: string;
      REDIS_URL: string;
      REDIS_DB: number;
      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
      JWT_SECRET: string;
      PORT: string;
    };
  }
}
