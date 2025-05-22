import type { FastifyInstance } from 'fastify';
import { toNodeHandler } from 'better-auth/node';

export default async function authRoutes(fastify: FastifyInstance) {
  const authHandler = toNodeHandler(fastify.auth.handler);

  fastify.addContentTypeParser('application/json', (_request, _payload, done) => {
    done(null, null);
  });

  fastify.route({
    method: ['POST', 'GET'],
    url: '/*',
    handler: async (req, reply) => await authHandler(req.raw, reply.raw),
  });
}
