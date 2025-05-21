import mongoose from 'mongoose';
import type { FastifyBaseLogger } from 'fastify';
import env from './env';

// 连接状态
let isConnected = false;

/**
 * 创建并获取 MongoDB 连接
 * @param options 可选的连接配置
 * @returns Mongoose 连接实例
 */
async function getMongoConnection(options?: {
  uri?: string;
  logger?: FastifyBaseLogger;
  connectionOptions?: mongoose.ConnectOptions;
}) {
  const { uri = env.DATABASE_URI, logger, connectionOptions = { serverSelectionTimeoutMS: 3000 } } = options || {};

  if (!uri) {
    const error = new Error('MongoDB URI is not provided');
    logger?.error(error);
    throw error;
  }

  // 如果已经连接，直接返回现有连接
  if (isConnected && mongoose.connection.readyState === 1) {
    logger?.debug('已存在 MongoDB 连接，复用现有连接');
    return mongoose.connection;
  }

  // 设置连接事件监听
  mongoose.connection.on('connected', () => {
    isConnected = true;
    logger?.debug('MongoDB connected!');
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger?.error('MongoDB disconnected!');
  });

  mongoose.connection.on('error', (err) => {
    logger?.error('MongoDB error:', err);
  });

  // 连接到 MongoDB
  logger?.info(`Connecting MongoDB to ${uri}...`);
  await mongoose.connect(uri, connectionOptions);

  return mongoose.connection;
}

/**
 * 关闭 MongoDB 连接
 * @param logger 可选的日志记录器
 */
async function closeMongoConnection(logger?: FastifyBaseLogger) {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger?.info('MongoDB connection closed.');
  }
}

export { getMongoConnection, closeMongoConnection, mongoose };
