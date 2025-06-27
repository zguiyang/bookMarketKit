import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';
import type { FastifyInstance } from 'fastify';
import redisClient from '@/lib/redis-client.js';

export default fp(async function (fastify: FastifyInstance) {
  fastify.log.info('Redis Connecting...');
  await fastify.register(fastifyRedis, {
    client: redisClient,
  });

  fastify.log.info('Redis Connected!');
});
