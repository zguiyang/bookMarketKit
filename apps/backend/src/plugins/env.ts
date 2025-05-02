import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import type { FastifyInstance } from 'fastify';


const schema = {
  type: 'object',
  required: [ 'DATABASE_URI', 'JWT_SECRET', 'REDIS_URL', 'REDIS_USERNAME', 'REDIS_PASSWORD', 'REDIS_DB' ],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    DATABASE_URI: {
      type: 'string',
    },
    REDIS_URL: {
      type: 'string',
    },
    REDIS_DB: {
      type: 'number',
      default: 0,
    },
    REDIS_USERNAME: {
      type: 'string',
    },
    REDIS_PASSWORD: {
      type: 'string',
    },
    JWT_SECRET: {
      type: 'string',
    },    
  }
}

export default fp(async (fastify: FastifyInstance) => {

  const NODE_ENV = process.env.NODE_ENV || 'development';

  fastify
  .register(fastifyEnv, {
    confKey: 'config',
    schema,
    dotenv: {
      path: ['.env', `.env.${NODE_ENV}`],
      debug: true,
    },
  })
  .ready((err) => {
    if (err) console.error(err)
    fastify.log.debug('env loaded!')
  })
}); 