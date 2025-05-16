import type { FastifyInstance } from 'fastify';

export default async function rootRoutes(fastify: FastifyInstance) {
  fastify.get('/', async () => ({ status: 'server is running!!!' }));
}
