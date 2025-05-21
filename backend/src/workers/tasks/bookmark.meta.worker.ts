import { BookmarkMetaFetchStatusEnum } from '@bookmark/schemas';
import { Queue } from '@/config/constant.config';
import { BookmarkFetchTask } from '@/interfaces/queue';
import { BookmarkModel } from '@/models/bookmark/bookmark.model';
import { fetchWebsiteMetadata } from '@/lib/meta-scraper';
import { getMongoConnection } from '@/lib/mongo-connection';
import redisClient from '@/lib/redis-client';
import { BaseWorker } from '../core/base-worker';

const TASK_NAME = `${Queue.queueName}:${Queue.bookmark.fetchMeta}`;
class BookmarkMetaWorker extends BaseWorker {
  protected async start(): Promise<void> {
    this.logger.info('Bookmark fetch worker started');
    await getMongoConnection({});
    this.startQueueListener();
  }

  /**
   * 开始监听队列
   */
  protected async startQueueListener() {
    this.logger.info(`[Worker] 开始监听队列: ${TASK_NAME}`);

    while (true) {
      try {
        const result = await redisClient.brpop(TASK_NAME, 3);

        if (result) {
          const [_, messageStr] = result;

          try {
            const task: BookmarkFetchTask = JSON.parse(messageStr);

            await this.processTask(task);
          } catch (parseError) {
            this.logger.error(`[Worker] 解析消息错误:`, parseError);
          }
        }
      } catch (error) {
        this.logger.error(`[Worker] Redis 队列监听错误:`, error);

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  protected async processTask(task: BookmarkFetchTask): Promise<void> {
    // TODO: 需实现错误补偿任务
    const { userId, id, url } = task;
    const bookmark = await BookmarkModel.findOne({ user: userId, _id: id });
    if (bookmark) {
      const meta = await fetchWebsiteMetadata(url).catch((err) => {
        this.logger.error(`[Worker] 获取元数据错误: ${err}`);
      });
      if (meta) {
        bookmark.title = meta.title;
        bookmark.description = meta.description;
        bookmark.icon = meta.logo;
        bookmark.metaFetchStatus = BookmarkMetaFetchStatusEnum.SUCCESS;
      } else {
        bookmark.metaFetchStatus = BookmarkMetaFetchStatusEnum.FAILED;
      }
      await bookmark.save();
      this.logger.info(`[Worker] 更新书签元数据成功: ${id}`);
    } else {
      this.logger.error(`[Worker] 书签不存在: ${id}`);
    }
  }

  protected async onShutdown(): Promise<void> {
    this.logger.info('Shutting down bookmark fetch worker');
    await redisClient.quit();
  }
}

new BookmarkMetaWorker();
