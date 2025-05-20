import { Queue } from '@/config/constant.config';
import { BookmarkFetchTask } from '@/interfaces/queue';
import { BaseWorker } from '../core/base-worker';
import { BookmarkModel } from '@/models/bookmark/bookmark.model';
import { fetchWebsiteMetadata } from '@/utils/meta-scraper';
import redisClient from '@/lib/redis-client';

class BookmarkMetaWorker extends BaseWorker {
  QueueTaskName = `${Queue.queueName}:${Queue.bookmark.fetchMeta}`;
  protected async start(): Promise<void> {
    this.log('info', 'Bookmark fetch worker started');
    this.startQueueListener();
  }

  /**
   * 开始监听队列
   */
  protected async startQueueListener() {
    console.log(`[Worker] 开始监听队列: ${this.QueueTaskName}`);

    while (true) {
      try {
        const result = await redisClient.brpop(this.QueueTaskName, 2);

        if (result) {
          const [_, messageStr] = result;

          try {
            const task: BookmarkFetchTask = JSON.parse(messageStr);

            // 记录任务开始处理
            console.log(`[Worker] 收到任务: ${task.id}`);
            await this.processTask(task);
          } catch (parseError) {
            console.error(`[Worker] 解析消息错误:`, parseError);
          }
        }
      } catch (error) {
        console.error(`[Worker] Redis 队列监听错误:`, error);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  protected async processTask(task: BookmarkFetchTask): Promise<void> {
    const { userId, id, url } = task;
    const bookmark = await BookmarkModel.findOne({ user: userId, _id: id });
    if (bookmark) {
      const meta = await fetchWebsiteMetadata(url);
      if (meta) {
        bookmark.title = meta.title;
        bookmark.description = meta.description;
        bookmark.icon = meta.logo;
        await bookmark.save();
      }
    } else {
      console.error(`[Worker] 书签不存在: ${id}`);
    }
  }

  protected async onShutdown(): Promise<void> {
    this.log('info', 'Shutting down bookmark fetch worker');
    await redisClient.quit();
  }
}

new BookmarkMetaWorker();
