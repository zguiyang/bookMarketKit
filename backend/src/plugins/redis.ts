import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';
import { FastifyInstance } from 'fastify';

export default fp(async function (fastify: FastifyInstance) {
  const redisUrl = fastify.env.REDIS_URL;
  await fastify.register(fastifyRedis, {
    url: redisUrl,
    // username: fastify.env.REDIS_USERNAME,
    // password: fastify.env.REDIS_PASSWORD,
    db: fastify.env.REDIS_DB,
  });
});
