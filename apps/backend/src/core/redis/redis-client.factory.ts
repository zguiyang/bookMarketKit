import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisClientFactory'); // 使用 NestJS 的 Logger
    const redisInstance = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });

    redisInstance.on('connect', () => {
      logger.log('Redis connected successfully'); // 替代 console.log
    });

    redisInstance.on('error', (e) => {
      logger.error(`Redis connection failed: ${e.message}`); // 替代 console.error
      throw new Error(`Redis connection failed: ${e.message}`);
    });

    return redisInstance;
  },
  inject: [ConfigService],
};
