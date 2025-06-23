import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import * as uploadCfg from '@/config/upload.config.js';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(multipart, uploadCfg.UPLOAD_CONFIG.multipart);
});
