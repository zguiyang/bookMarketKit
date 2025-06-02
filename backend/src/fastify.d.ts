import type { SessionUser } from '../../packages/auth/src';
import type { AuthType } from '../../packages/auth';
import type { FastifyInstance as OriginalFastifyInstance } from 'fastify';
import type { EnvConfig } from '@/lib/env';
import { WorkerManager } from '@/workers/core/worker-manager';

declare module 'fastify' {
  interface FastifyRequest {
    currentUser: SessionUser;
  }

  interface FastifyInstance {
    env: EnvConfig;
    auth: AuthType;
    workerManager: WorkerManager;
  }
}
