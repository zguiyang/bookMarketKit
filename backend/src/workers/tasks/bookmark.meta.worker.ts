import { SuccessResult, ErrorResult } from 'open-graph-scraper/types';
import { WebsiteMetaFetchEnums } from '@bookmark/schemas';
import { QueueConfig } from '@/config/constant.config';
import { BookmarkFetchTask } from '@/interfaces/queue.interface';
import { BookmarkModel } from '@/models/bookmark/bookmark.model';
import { WebsiteMetaModel } from '@/models/website-meta.model';
import { fetchWebsiteMetadata } from '@/lib/meta-scraper';
import { getMongoConnection, closeMongoConnection } from '@/lib/mongo-connection';
import { normalizeUrlSafe } from '@/utils/url';
import QueueLib from '@/lib/queue';
import redisClient from '@/lib/redis-client';
import { BaseWorker } from '../core/base-worker';

const META_CACHE_PREFIX = QueueConfig.cache.META_CACHE_PREFIX;
const CACHE_TTL = 60 * 60 * 24; // 24小时缓存
const TASK_NAME = QueueConfig.bookmark.fetchMeta;

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
      const task = await QueueLib.getTaskBlocking<BookmarkFetchTask>(TASK_NAME, 2);

      if (task) {
        await this.processTask(task);
      }
    }
  }

  /**
   * 获取缓存键
   * @param url 网址
   */
  private getCacheKey(url: string): string {
    // 规范化 URL 以确保相同的 URL 有相同的缓存键
    const normalizedUrl = normalizeUrlSafe(url);
    return `${META_CACHE_PREFIX}${normalizedUrl}`;
  }

  /**
   * 检查 URL 元数据是否已缓存
   * @param url 网址
   */
  private async checkMetaCache(url: string): Promise<boolean> {
    try {
      const cacheKey = this.getCacheKey(url);
      const exists = await redisClient.exists(cacheKey);
      return exists === 1;
    } catch (error) {
      this.logger.error(`[Worker] Redis 缓存检查错误:`, error);
      return false;
    }
  }

  /**
   * 从数据库获取已缓存的元数据
   * @param url 网址
   */
  private async getMetaFromDatabase(url: string): Promise<any | null> {
    try {
      // 查找最近成功抓取的元数据
      const meta = await WebsiteMetaModel.findOne({
        url: normalizeUrlSafe(url),
        fetchStatus: WebsiteMetaFetchEnums.SUCCESS,
      })
        .sort({ updatedAt: -1 })
        .lean();

      return meta;
    } catch (error) {
      this.logger.error(`[Worker] 从数据库获取元数据错误:`, error);
      return null;
    }
  }

  /**
   * 将 URL 添加到缓存
   * @param url 网址
   */
  private async addUrlToCache(url: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(url);
      await redisClient.set(cacheKey, '1', 'EX', CACHE_TTL);
      this.logger.debug(`[Worker] URL 已添加到缓存: ${url}`);
    } catch (error) {
      this.logger.error(`[Worker] Redis 缓存添加错误:`, error);
    }
  }

  /**
   * 更新书签和元数据记录
   * @param bookmark 书签模型实例
   * @param websiteMeta 网站元数据模型实例
   * @param metaData 元数据信息
   * @param fetchStatus 抓取状态
   */
  private async updateRecords(
    bookmark: any,
    websiteMeta: any,
    metaData: ErrorResult | SuccessResult,
    fetchStatus: keyof typeof WebsiteMetaFetchEnums
  ): Promise<void> {
    if (metaData.result && metaData.result.success) {
      bookmark.meta = websiteMeta._id;
      bookmark.title = metaData.result?.ogTitle ?? '';
      bookmark.description = metaData.result.ogDescription ?? '';
      bookmark.icon = metaData.result?.favicon;

      // 更新元数据信息
      websiteMeta.url = bookmark.url;
      websiteMeta.ogsResult = metaData.result ? JSON.stringify(metaData.result) : '';
      websiteMeta.ogsResponse = '';
      websiteMeta.ogsHtml = metaData.html;
    }

    websiteMeta.fetchStatus = fetchStatus;

    if (metaData.error) {
      websiteMeta.error = 'bookmark meta fetch failed!';
    }

    // 保存更新
    await Promise.all([websiteMeta.save(), bookmark.save()]);
  }

  protected async processTask(task: BookmarkFetchTask): Promise<void> {
    // TODO: 需实现错误补偿任务
    const { userId, bookmarkId, metaId, url } = task;
    const bookmark = await BookmarkModel.findOne({ user: userId, _id: bookmarkId });
    const websiteMeta = await WebsiteMetaModel.findOne({ _id: metaId });

    if (!bookmark || !websiteMeta) {
      this.logger.error(`[Worker] 书签或书签元数据记录不存在: ${bookmarkId}`);
      return;
    }

    try {
      // 检查 URL 是否已缓存
      const isCached = await this.checkMetaCache(url);

      if (isCached) {
        // URL 已缓存，从数据库获取元数据
        this.logger.info(`[Worker] URL 已缓存，从数据库获取: ${url}`);
        const cachedMeta = await this.getMetaFromDatabase(url);

        if (cachedMeta) {
          // 使用缓存的元数据更新记录
          await this.updateRecords(bookmark, websiteMeta, cachedMeta, WebsiteMetaFetchEnums.SUCCESS);
          this.logger.info(`[Worker] 使用缓存更新书签元数据成功: ${bookmarkId}`);
          return;
        }
      }

      // 缓存未命中或没有可用的缓存数据，执行实时抓取
      this.logger.info(`[Worker] 缓存未命中，执行实时抓取: ${url}`);
      const fetchedMeta = await fetchWebsiteMetadata(url);

      this.logger.info(`[Worker] 抓取结果：${(fetchedMeta.error, fetchedMeta.response)}`);
      if (fetchedMeta.error) {
        websiteMeta.fetchStatus = WebsiteMetaFetchEnums.FAILED;
        await websiteMeta.save();
      } else {
        await this.updateRecords(bookmark, websiteMeta, fetchedMeta, WebsiteMetaFetchEnums.SUCCESS);
        this.logger.info(`[Worker] 更新书签元数据成功: ${bookmarkId}`);
        await this.addUrlToCache(url);
      }
    } catch (err: any) {
      websiteMeta.fetchStatus = WebsiteMetaFetchEnums.FAILED;
      websiteMeta.error = err.message ?? 'website meta Fetching failed';
      this.logger.error(`[Worker] 获取元数据错误: ${err.message}`);
      await websiteMeta.save();
    }
  }

  /**
   * 清除特定 URL 的缓存
   * @param url 网址
   */
  public async clearUrlCache(url: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(url);
      await redisClient.del(cacheKey);
      this.logger.info(`[Worker] 已清除 URL 缓存: ${url}`);
    } catch (error) {
      this.logger.error(`[Worker] 清除缓存错误:`, error);
    }
  }

  /**
   * 清除所有元数据缓存
   */
  public async clearAllCache(): Promise<void> {
    try {
      const keys = await redisClient.keys(`${META_CACHE_PREFIX}*`);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        this.logger.info(`[Worker] 已清除所有元数据缓存 (${keys.length} 条)`);
      }
    } catch (error) {
      this.logger.error(`[Worker] 清除所有缓存错误:`, error);
    }
  }

  protected async onShutdown(): Promise<void> {
    this.logger.info('Shutting down bookmark fetch worker');
    await redisClient.quit();
    await closeMongoConnection();
  }
}

new BookmarkMetaWorker();
