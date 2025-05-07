import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  // 注册 JWT 插件
  await fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
  });
});
