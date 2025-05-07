import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';
import { FastifyInstance } from 'fastify';

export default fp(async function (fastify: FastifyInstance) {
  const redisUrl = fastify.config.REDIS_URL;
  await fastify.register(fastifyRedis, {
    url: redisUrl,
    // username: fastify.config.REDIS_USERNAME,
    // password: fastify.config.REDIS_PASSWORD,
    db: fastify.config.REDIS_DB,
  });
});
