import fp from 'fastify-plugin';
import { WorkerManager } from '@/workers/core/worker-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default fp(async (fastify) => {
  const workerDir = path.join(__dirname, '..', 'workers', 'tasks');
  const workerManager = new WorkerManager(fastify, workerDir);

  fastify.decorate('workerManager', workerManager);

  fastify.addHook('onReady', async () => {
    fastify.log.info('All Workers Running...');
    await workerManager.startAll();
  });

  fastify.addHook('onClose', async () => {
    fastify.log.info('Stop All Workers...');
    await workerManager.stopAll();
  });
});
