import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';


export default fp(async (fastify: FastifyInstance) => {
// 注册 Swagger 插件
await fastify.register(fastifySwagger as any, {
  openapi: {
    info: {
      title: 'API 文档',
      description: 'Bookmark API 文档',
      version: '0.0.1'
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

// 注册 Swagger UI 插件
await fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs',
}).ready(() => {
  fastify.log.info(`📚 Swagger docs at http://localhost:${fastify.config.PORT as string}/docs`);
});

}); 