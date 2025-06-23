import mongoose from 'mongoose';
import type { FastifyBaseLogger } from 'fastify';
import env from './env.js';

// Connection status
let isConnected = false;

/**
 * Creates and retrieves a MongoDB connection.
 * @param options Optional connection configuration.
 * @returns Mongoose connection instance.
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

  // If already connected, return the existing connection directly.
  if (isConnected && mongoose.connection.readyState === 1) {
    logger?.debug('MongoDB connection already exists, reusing existing connection.');
    return mongoose.connection;
  }

  // Set up connection event listeners.
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

  // Connect to MongoDB
  logger?.info(`Connecting MongoDB to ${uri}...`);
  await mongoose.connect(uri, connectionOptions);

  return mongoose.connection;
}

/**
 * Closes the MongoDB connection.
 * @param logger Optional logger.
 */
async function closeMongoConnection(logger?: FastifyBaseLogger) {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger?.info('MongoDB connection closed.');
  }
}

export { getMongoConnection, closeMongoConnection, mongoose };
