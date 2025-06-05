import Redis from 'ioredis';
import env from './env';

const { REDIS_URL, REDIS_DB, REDIS_PASSWORD } = env;

const url = new URL(REDIS_URL);
const host = url.hostname;
const port = parseInt(url.port || '6379', 10);

const redisClient = new Redis({
  host,
  port,
  password: REDIS_PASSWORD,
  db: REDIS_DB,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});

export default redisClient;
