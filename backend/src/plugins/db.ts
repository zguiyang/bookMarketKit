import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { getMongoConnection, closeMongoConnection } from '@/lib/mongo-connection';

export default fp(async (fastify: FastifyInstance) => {
  await getMongoConnection({
    logger: fastify.log,
  });
  fastify.addHook('onClose', async (instance) => {
    await closeMongoConnection(instance.log);
  });
});
