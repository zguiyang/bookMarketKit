import Redis from 'ioredis';
import env from './env';

const { REDIS_URL, REDIS_DB } = env;

const url = new URL(REDIS_URL || 'redis://localhost:6379');
const host = url.hostname;
const port = parseInt(url.port || '6379', 10);

const redisClient = new Redis({
  host,
  port,
  // username: REDIS_USERNAME || undefined,
  // password: REDIS_PASSWORD || undefined,
  db: REDIS_DB,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});

export default redisClient;
