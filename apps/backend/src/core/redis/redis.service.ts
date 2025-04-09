import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger('RedisService'); // 创建 Logger 实例

  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  // 设置键值对
  async set(
    key: string,
    value: string,
    expireInSeconds?: number,
  ): Promise<void> {
    try {
      if (expireInSeconds) {
        await this.redisClient.set(key, value, 'EX', expireInSeconds);
      } else {
        await this.redisClient.set(key, value);
      }
    } catch (error) {
      throw error;
    }
  }

  // 获取值
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redisClient.get(key);
      return value;
    } catch (error) {
      throw error;
    }
  }

  // 删除键
  async del(key: string): Promise<number> {
    try {
      const result = await this.redisClient.del(key);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 检查键是否存在
  async hasExists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      throw error;
    }
  }

  async setAssessToken(key: string, token: string) {
    const result = await this.set(`assess:${key}`, token, 7 * 24 * 60 * 60);
    return result;
  }

  async getAssessToken(key: string) {
    const token = await this.get(`assess:${key}`);
    return token;
  }
  async delAssessToken(key: string) {
    const result = await this.del(`assess:${key}`);
    return result;
  }

  // 模块销毁时关闭 Redis 连接
  onModuleDestroy() {
    this.redisClient.quit();
  }
}
