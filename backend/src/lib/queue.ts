import { QueueConfig } from '@/config/constant.config.js';
import Logger from '@/utils/logger.js';
import redisClient from '@/lib/redis-client.js';

export class QueueLib {
  private readonly queuePrefix: string = QueueConfig.queuePrefix;
  private readonly redis = redisClient;
  private readonly logger = Logger;
  private listeners: Map<string, { stop: () => void }> = new Map();
  private listenerStatus: Map<
    string,
    {
      isRunning: boolean;
      tasksProcessed: number;
      lastProcessedAt: Date | null;
      errors: number;
      startedAt: Date;
    }
  > = new Map();

  constructor() {}

  /**
   * 获取队列名称
   * @param taskName 任务名称
   * @returns 完整的队列名称
   */
  private getQueueName(taskName: string): string {
    return `${this.queuePrefix}:${taskName}`;
  }
  /**
   * 添加任务到队列
   * @param taskName 任务名称
   * @param task 任务数据
   * @param ttl 可选，队列的过期时间（秒）
   * @returns 添加后的队列长度
   */
  async addTask<T = Record<string, any>>(taskName: string, task: T, ttl?: number): Promise<number> {
    try {
      const queueName = this.getQueueName(taskName);
      const taskString = JSON.stringify(task);
      const length = await this.redis.lpush(queueName, taskString);

      // 如果设置了TTL，则为这个队列设置过期时间
      if (typeof ttl === 'number' && ttl > 0) {
        await this.redis.expire(queueName, ttl);
      }

      return length;
    } catch (error) {
      this.logger.error(`Error adding task to queue ${taskName}: ${error}`);
      throw error;
    }
  }

  /**
   * 获取队列中的任务（非阻塞）
   * @param taskName 任务名称
   * @returns 任务数据，如果队列为空则返回null
   */
  async getTask<T = Record<string, any>>(taskName: string): Promise<T | null> {
    try {
      const queueName = this.getQueueName(taskName);
      const taskString = await this.redis.rpop(queueName);

      if (!taskString) {
        return null;
      }

      return JSON.parse(taskString) as T;
    } catch (error) {
      this.logger.error(`Error getting task from queue ${taskName}: ${error}`);
      throw error;
    }
  }

  /**
   * 获取队列中的任务（阻塞模式）
   * @param taskName 任务名称
   * @param timeout 超时时间（秒），0表示永久阻塞
   * @returns 任务数据，如果超时则返回null
   */
  async getTaskBlocking<T = Record<string, any>>(taskName: string, timeout: number = 0): Promise<T | null> {
    try {
      const queueName = this.getQueueName(taskName);
      const result = await this.redis.brpop(queueName, timeout);

      if (!result) {
        return null;
      }

      // brpop返回的是[key, value]格式
      const [_, taskString] = result;

      return JSON.parse(taskString) as T;
    } catch (error) {
      this.logger.error(`Error getting task from queue ${taskName} with blocking: ${error}`);
      throw error;
    }
  }

  /**
   * 获取队列长度
   * @param taskName 任务名称
   * @returns 队列长度
   */
  async getQueueLength(taskName: string): Promise<number> {
    try {
      const queueName = this.getQueueName(taskName);
      return await this.redis.llen(queueName);
    } catch (error) {
      this.logger.error(`Error getting queue length for ${taskName}: ${error}`);
      throw error;
    }
  }

  /**
   * 开始监听队列消息并处理任务
   * @param taskName 任务名称
   * @param handler 处理任务的回调函数
   * @param options 监听选项
   */
  startListening<T = Record<string, any>>(
    taskName: string,
    handler: (task: T) => Promise<void>,
    options: {
      blockTimeout?: number; // brpop 阻塞超时时间（秒）
      errorDelay?: number; // 出错后重试延迟（毫秒）
      maxConcurrent?: number; // 最大并发处理数
    } = {}
  ): { stop: () => void } {
    // 如果已经有监听器在运行，先停止它
    if (this.listeners.has(taskName)) {
      this.logger.warn(`Listener for queue ${taskName} already exists. Stopping existing listener.`);
      this.stopListening(taskName);
    }

    const { blockTimeout = 0, errorDelay = 1000, maxConcurrent = 1 } = options;
    const queueName = this.getQueueName(taskName);

    // 标记是否应该继续处理
    let isRunning = true;
    let activeProcessors = 0;

    // 初始化状态跟踪
    this.listenerStatus.set(taskName, {
      isRunning: true,
      tasksProcessed: 0,
      lastProcessedAt: null,
      errors: 0,
      startedAt: new Date(),
    });

    const processNextTask = async () => {
      if (!isRunning) return;

      // 控制并发数
      if (activeProcessors >= maxConcurrent) {
        // 等待一小段时间后再检查
        setTimeout(processNextTask, 100);
        return;
      }

      activeProcessors++;

      try {
        // 使用阻塞方式获取任务 - 这里直接使用taskName，而不是queueName
        // 因为getTaskBlocking方法内部会调用this.getQueueName
        const task = await this.getTaskBlocking<T>(taskName, blockTimeout);

        if (task) {
          this.logger.debug(`Processing task from queue ${queueName}`); // 使用完整队列名称记录日志

          try {
            await handler(task);

            // 更新状态
            const status = this.listenerStatus.get(taskName);
            if (status) {
              status.tasksProcessed++;
              status.lastProcessedAt = new Date();
            }
          } catch (handlerError) {
            this.logger.error(`Error in task handler for ${queueName}: ${handlerError}`); // 使用完整队列名称

            // 更新错误计数
            const status = this.listenerStatus.get(taskName);
            if (status) {
              status.errors++;
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error processing queue ${queueName}: ${error}`); // 使用完整队列名称

        // 更新错误计数
        const status = this.listenerStatus.get(taskName);
        if (status) {
          status.errors++;
        }

        // 出错后稍微等待一下再继续，避免CPU占用过高
        await new Promise((resolve) => setTimeout(resolve, errorDelay));
      } finally {
        activeProcessors--;
      }

      // 使用setImmediate避免调用栈溢出，同时保持事件循环畅通
      setImmediate(() => processNextTask());
    };

    // 启动多个处理器（根据maxConcurrent）
    for (let i = 0; i < maxConcurrent; i++) {
      processNextTask();
    }

    // 创建停止函数
    const stopFn = {
      stop: () => {
        this.logger.info(`Stopping listener for queue ${queueName}`); // 使用完整队列名称
        isRunning = false;

        // 更新状态
        const status = this.listenerStatus.get(taskName);
        if (status) {
          status.isRunning = false;
        }
      },
    };

    // 保存监听器引用
    this.listeners.set(taskName, stopFn);

    this.logger.info(`Started listening to queue ${queueName} with max ${maxConcurrent} concurrent processors`); // 使用完整队列名称

    return stopFn;
  }

  /**
   * 停止特定队列的监听
   * @param taskName 任务名称
   * @returns 是否成功停止
   */
  stopListening(taskName: string): boolean {
    const listener = this.listeners.get(taskName);
    if (listener) {
      listener.stop();
      this.listeners.delete(taskName);
      return true;
    }
    return false;
  }

  /**
   * 停止所有队列监听
   */
  stopAllListeners(): void {
    this.logger.info('Stopping all queue listeners');
    for (const [taskName, listener] of this.listeners.entries()) {
      this.logger.debug(`Stopping listener for ${taskName}`);
      listener.stop();
    }
    this.listeners.clear();
  }

  /**
   * 获取所有监听器的状态
   * @returns 所有监听器的状态
   */
  getListenersStatus(): Record<string, any> {
    const status: Record<string, any> = {};

    for (const [taskName, listenerStatus] of this.listenerStatus.entries()) {
      status[taskName] = {
        ...listenerStatus,
        isActive: this.listeners.has(taskName),
        queueLength: 'unknown', // 可以异步获取实际队列长度
      };
    }

    return status;
  }

  /**
   * 异步获取所有监听器的详细状态（包括当前队列长度）
   * @returns 所有监听器的详细状态
   */
  async getDetailedStatus(): Promise<Record<string, any>> {
    const status: Record<string, any> = {};

    for (const [taskName, listenerStatus] of this.listenerStatus.entries()) {
      const queueLength = await this.getQueueLength(taskName);

      status[taskName] = {
        ...listenerStatus,
        isActive: this.listeners.has(taskName),
        queueLength,
        // 计算处理速率（每分钟）
        processingRate:
          listenerStatus.tasksProcessed / ((new Date().getTime() - listenerStatus.startedAt.getTime()) / 60000),
      };
    }

    return status;
  }

  /**
   * 清空指定队列
   * @param taskName 任务名称
   * @returns 是否成功清空
   */
  async clearQueue(taskName: string): Promise<boolean> {
    try {
      const queueName = this.getQueueName(taskName);
      await this.redis.del(queueName);
      return true;
    } catch (error) {
      this.logger.error(`Error clearing queue ${taskName}: ${error}`);
      throw error;
    }
  }

  /**
   * 获取队列中的所有任务（不移除）
   * @param taskName 任务名称
   * @param start 开始索引
   * @param end 结束索引
   * @returns 任务列表
   */
  async peekTasks<T = Record<string, any>>(taskName: string, start: number = 0, end: number = -1): Promise<T[]> {
    try {
      const queueName = this.getQueueName(taskName);
      const tasks = await this.redis.lrange(queueName, start, end);

      return tasks.map((task: any) => JSON.parse(task) as T);
    } catch (error) {
      this.logger.error(`Error peeking tasks from queue ${taskName}: ${error}`);
      throw error;
    }
  }
}

export default new QueueLib();
