import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export default fp(async (fastify: FastifyInstance) => {
  // Register Swagger plugin
  await fastify.register(fastifySwagger as any, {
    openapi: {
      info: {
        title: 'API Documentation',
        description: 'Bookmark API Documentation',
        version: '0.0.1',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });

  // Register Swagger UI plugin
  fastify
    .register(fastifySwaggerUi, {
      routePrefix: '/docs',
    })
    .ready(() => {
      fastify.log.info(`📚 Swagger docs at http://localhost:${fastify.env.PORT}/docs`);
    });
});
