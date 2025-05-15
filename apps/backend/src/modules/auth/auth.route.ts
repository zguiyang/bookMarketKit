import type { FastifyInstance } from 'fastify';
import { createAuthInstance } from '@/core/auth';
import { AuthController } from './auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController(createAuthInstance(fastify.config.DATABASE_URI));

  fastify.route({
    url: '/*',
    method: ['GET', 'POST'],
    schema: {}, // better auth routes not to use this
    handler: (req, reply) => authController.bearerAuth(req, reply),
  });
}
