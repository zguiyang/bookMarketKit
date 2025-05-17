import type { SessionUser } from '@bookmark/auth';

declare module 'fastify' {
  interface FastifyRequest {
    currentUser: SessionUser;
  }
}
