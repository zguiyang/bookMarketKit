import { WebsiteMetaFetchEnums } from '@bookmark/schemas';
import { Queue } from '@/config/constant.config';
import { BookmarkFetchTask } from '@/interfaces/queue';
import { BookmarkModel } from '@/models/bookmark/bookmark.model';
import { WebsiteMetaModel } from '@/models/website-meta.model';
import { fetchWebsiteMetadata } from '@/lib/meta-scraper';
import { getMongoConnection, closeMongoConnection } from '@/lib/mongo-connection';
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

    while (this.isRunning()) {
      try {
        const result = await redisClient.brpop(TASK_NAME, 2);

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

        // await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  protected async processTask(task: BookmarkFetchTask): Promise<void> {
    // TODO: 需实现错误补偿任务
    const { userId, bookmarkId, metaId, url } = task;
    const bookmark = await BookmarkModel.findOne({ user: userId, _id: bookmarkId });
    const websiteMeta = await WebsiteMetaModel.findOne({ _id: metaId });

    if (bookmark && websiteMeta) {
      const fetchedMeta = await fetchWebsiteMetadata(url).catch(async (err) => {
        websiteMeta.fetchStatus = WebsiteMetaFetchEnums.FAILED;
        websiteMeta.error = err.message ?? 'website meta Fetching failed';
        this.logger.error(`[Worker] 获取元数据错误: ${err}`);
        return await websiteMeta.save();
      });
      if (fetchedMeta) {
        websiteMeta.fetchStatus = WebsiteMetaFetchEnums.SUCCESS;
        bookmark.title = fetchedMeta.title ?? '';
        bookmark.description = fetchedMeta.description ?? '';
        bookmark.icon = fetchedMeta.logo ?? '';

        websiteMeta.title = fetchedMeta.title ?? '';
        websiteMeta.description = fetchedMeta.description ?? '';
        websiteMeta.logo = fetchedMeta.logo ?? '';
        websiteMeta.audio = fetchedMeta.audio ?? '';
        websiteMeta.video = fetchedMeta.video ?? '';
        websiteMeta.lang = fetchedMeta.lang ?? '';
        websiteMeta.author = fetchedMeta.author ?? '';
        websiteMeta.publisher = fetchedMeta.publisher ?? '';
        websiteMeta.date = fetchedMeta.date ?? '';
        websiteMeta.url = fetchedMeta.url ?? '';
        websiteMeta.fetchTime = fetchedMeta.fetchTime;
        websiteMeta.parseTime = fetchedMeta.parseTime;
        if (fetchedMeta.error) {
          websiteMeta.error = fetchedMeta.error ?? '';
          websiteMeta.fetchStatus = WebsiteMetaFetchEnums.FAILED;
        }
      } else {
        websiteMeta.fetchStatus = WebsiteMetaFetchEnums.FAILED;
      }
      await websiteMeta.save();
      await bookmark.save();

      this.logger.info(`[Worker] 更新书签元数据成功: ${bookmarkId}`);
    } else {
      this.logger.error(`[Worker] 书签或书签元数据记录不存在: ${bookmarkId}`);
    }
  }

  protected async onShutdown(): Promise<void> {
    this.logger.info('Shutting down bookmark fetch worker');
    await redisClient.quit();
    await closeMongoConnection();
  }
}

new BookmarkMetaWorker();
