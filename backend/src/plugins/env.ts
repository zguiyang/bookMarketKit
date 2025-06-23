import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import env from '@/lib/env.js';

export default fp(async (fastify: FastifyInstance) => {
  if (fastify.env) {
    return;
  }

  try {
    fastify.decorate('env', env);
    fastify.log.info('Load env plugin success');
  } catch (err: any) {
    fastify.log.error(`Load env plugin failed, ${err.message}`, err);
  }
});
