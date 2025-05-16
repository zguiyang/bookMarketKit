import type { FastifyInstance as OriginalFastifyInstance } from 'fastify';
import type { EnvConfig } from '@/lib/env';
import type { AuthType } from '@bookmark/auth';

declare module 'fastify' {
  interface FastifyInstance {
    env: EnvConfig;
    auth: AuthType;
  }
}
