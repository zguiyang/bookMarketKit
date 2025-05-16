import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import type { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  const uri = fastify.env.DATABASE_URI;
  // 监听默认连接的事件
  mongoose.connection.on('connected', () => {
    fastify.log.debug('MongoDB connected!');
  });
  mongoose.connection.on('disconnected', () => {
    fastify.log.error('MongoDB disconnected!');
  });
  // 监听错误事件
  mongoose.connection.on('error', (err) => {
    fastify.log.error('MongoDB error:', err);
  });

  fastify.log.info(`Connecting MongoDB to ${uri}...`);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 3000,
  });
  // Fastify 关闭时断开连接
  fastify.addHook('onClose', async (instance) => {
    await mongoose.disconnect();
    instance.log.info('MongoDB closed.');
  });

  fastify.addHook('onClose', async () => {
    await mongoose.disconnect();
    fastify.log.debug('database disconnected');
  });
});
