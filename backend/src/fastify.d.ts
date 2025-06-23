import type { SessionUser } from '@bookmark/auth';
import type { AuthType } from '@bookmark/auth';
import type { FastifyInstance as OriginalFastifyInstance } from 'fastify';
import type { EnvConfig } from '@/lib/env.js';
import { WorkerManager } from '@/workers/core/worker-manager.js';

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
