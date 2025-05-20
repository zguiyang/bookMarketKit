import type { FastifyInstance } from 'fastify';
// import { toNodeHandler } from 'better-auth/node';
import { AuthController } from './auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  // const authHandler = toNodeHandler(fastify.auth.handler);
  const authController = new AuthController(fastify);

  // fastify.addContentTypeParser('application/json', (_request, _payload, done) => {
  //   done(null, null);
  // });

  // fastify.route({
  //   method: ['POST', 'GET'],
  //   url: '/*',
  //   handler: async (req, reply) => await authHandler(req.raw, reply.raw),
  // });

  fastify.route({
    url: '/*',
    method: ['GET', 'POST'],
    schema: {}, // better auth routes not to use this
    handler: (req, reply) => authController.bearerAuth(req, reply),
  });
}
