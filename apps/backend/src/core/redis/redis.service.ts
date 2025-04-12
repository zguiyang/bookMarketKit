import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private readonly lockTimeout = 10000; // Lock timeout in milliseconds, default 10s
  private readonly retryDelay = 100; // Retry delay in milliseconds, default 100ms
  private readonly maxRetries = 5; // Maximum retry attempts

  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {
    this.client = redisClient;
  }

  /**
   * Set a key-value pair in Redis with optional expiration
   * @param key - The key to set
   * @param value - The value to store
   * @param expireInSeconds - Optional expiration time in seconds
   */
  async set(
    key: string,
    value: string,
    expireInSeconds?: number,
  ): Promise<void> {
    if (expireInSeconds) {
      await this.client.set(key, value, 'EX', expireInSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Get the value for a given key from Redis
   * @param key - The key to retrieve
   * @returns The value associated with the key, or null if not found
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * Delete a key from Redis
   * @param key - The key to delete
   * @returns Number of keys deleted
   */
  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  /**
   * Check if a key exists in Redis
   * @param key - The key to check
   * @returns Boolean indicating if the key exists
   */
  async hasExists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * Set access token with prefix 'assess:'
   * @param key - The key for the access token
   * @param token - The access token to store
   * @returns Promise<void>
   */
  async setAssessToken(key: string, token: string) {
    return await this.set(`assess:${key}`, token, 7 * 24 * 60 * 60);
  }

  /**
   * Get access token by key
   * @param key - The key for the access token
   * @returns Promise<string | null>
   */
  async getAssessToken(key: string) {
    return await this.get(`assess:${key}`);
  }

  /**
   * Remove access token by key
   * @param key - The key for the access token to remove
   * @returns Promise<number>
   */
  async removeAssessToken(key: string) {
    return await this.del(`assess:${key}`);
  }

  /**
   * Push an item to the end of a queue
   * @param queueName - Name of the queue
   * @param data - Data to push to the queue
   * @param expireInSeconds - Optional expiration time in seconds, default 60s
   */
  async pushToQueue(
    queueName: string,
    data: any,
    expireInSeconds: number = 60,
  ): Promise<void> {
    const serializedData = JSON.stringify(data);
    const multi = this.client.multi();
    multi.rpush(queueName, serializedData);
    multi.expire(queueName, expireInSeconds);
    await multi.exec();
  }

  /**
   * Pop an item from the beginning of a queue
   * @param queueName - Name of the queue
   * @returns The first item in the queue, or null if queue is empty
   */
  async popFromQueue(queueName: string): Promise<any> {
    const data = await this.client.lpop(queueName);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get the length of a queue
   * @param queueName - Name of the queue
   * @returns Number of items in the queue
   */
  async getQueueLength(queueName: string): Promise<number> {
    return this.client.llen(queueName);
  }

  /**
   * Push an item to a queue with distributed lock protection
   * @param queueName - Name of the queue
   * @param data - Data to push to the queue
   * @param expireInSeconds - Optional expiration time in seconds, default 60s
   */
  async pushToQueueWithLock(
    queueName: string,
    data: any,
    expireInSeconds: number = 60,
  ): Promise<void> {
    const lockKey = `lock:${queueName}`;
    await this.acquireLock(lockKey);
    await this.pushToQueue(queueName, data, expireInSeconds);
    await this.releaseLock(lockKey);
  }

  /**
   * Pop an item from a queue with distributed lock protection
   * @param queueName - Name of the queue
   * @returns The first item in the queue, or null if queue is empty
   */
  async popFromQueueWithLock(queueName: string): Promise<any> {
    const lockKey = `lock:${queueName}`;
    await this.acquireLock(lockKey);
    const result = await this.popFromQueue(queueName);
    await this.releaseLock(lockKey);
    return result;
  }

  /**
   * Acquire a distributed lock
   * @param lockKey - Key for the lock
   * @returns Boolean indicating if the lock was acquired
   * @private
   */
  private async acquireLock(lockKey: string): Promise<boolean> {
    let retries = 0;
    while (retries < this.maxRetries) {
      const acquired = await this.client.set(
        lockKey,
        '1',
        'EX',
        this.lockTimeout / 1000,
        'NX',
      );
      if (acquired) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      retries++;
    }
    throw new Error(
      `Failed to acquire lock [${lockKey}] after ${this.maxRetries} retries`,
    );
  }

  /**
   * Release a distributed lock
   * @param lockKey - Key for the lock to release
   * @private
   */
  private async releaseLock(lockKey: string): Promise<void> {
    await this.client.del(lockKey);
  }

  /**
   * Push multiple items to a queue in a single operation
   * @param queueName - Name of the queue
   * @param items - Array of items to push to the queue
   * @param expireInSeconds - Optional expiration time in seconds, default 60s
   */
  async pushBulkToQueue(
    queueName: string,
    items: any[],
    expireInSeconds: number = 60,
  ): Promise<void> {
    const lockKey = `lock:${queueName}`;
    await this.acquireLock(lockKey);
    const multi = this.client.multi();
    items.forEach((item) => {
      multi.rpush(queueName, JSON.stringify(item));
    });
    multi.expire(queueName, expireInSeconds);
    await multi.exec();
    await this.releaseLock(lockKey);
  }

  /**
   * Get a range of items from a queue
   * @param queueName - Name of the queue
   * @param start - Start index (0-based)
   * @param end - End index (-1 means until the end)
   * @returns Array of items in the specified range
   */
  async getQueueItems(
    queueName: string,
    start: number = 0,
    end: number = -1,
  ): Promise<any[]> {
    const items = await this.client.lrange(queueName, start, end);
    return items.map((item) => JSON.parse(item));
  }

  /**
   * Clear all items from a queue
   * @param queueName - Name of the queue to clear
   */
  async clearQueue(queueName: string): Promise<void> {
    const lockKey = `lock:${queueName}`;
    await this.acquireLock(lockKey);
    await this.client.del(queueName);
    await this.releaseLock(lockKey);
  }

  /**
   * 获取队列的过期时间
   * @param queueName - 队列名称
   * @returns 过期时间（秒），-1表示没有过期时间，-2表示队列不存在
   */
  async getQueueTTL(queueName: string): Promise<number> {
    return await this.client.ttl(queueName);
  }

  /**
   * 更新队列的过期时间
   * @param queueName - 队列名称
   * @param expireInSeconds - 新的过期时间（秒），默认 60s
   * @returns 是否设置成功
   */
  async updateQueueExpire(
    queueName: string,
    expireInSeconds: number = 60,
  ): Promise<boolean> {
    const exists = await this.client.exists(queueName);
    if (exists) {
      return (await this.client.expire(queueName, expireInSeconds)) === 1;
    }
    return false;
  }

  /**
   * Cleanup method called when the module is destroyed
   * Closes the Redis connection
   */
  onModuleDestroy() {
    this.client.quit();
  }
}
