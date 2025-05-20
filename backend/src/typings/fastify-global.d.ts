import type { FastifyInstance as OriginalFastifyInstance } from 'fastify';
import type { EnvConfig } from '@/lib/env';
import type { AuthType } from '@bookmark/auth';
import { ServiceMap } from '@/plugins/services';
import { WorkerManager } from '@/workers/core/worker-manager';

declare module 'fastify' {
  interface FastifyInstance {
    env: EnvConfig;
    auth: AuthType;
    services: ServiceMap;
    workerManager: WorkerManager;
  }
}
