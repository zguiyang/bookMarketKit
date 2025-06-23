import { SuccessResult, ErrorResult } from 'open-graph-scraper/types';
import { WebsiteMetaFetchEnums } from '@bookmark/schemas';
import { QueueConfig } from '@/config/constant.config.js';
import { BookmarkFetchTask } from '@/types/queue.interface.js';
import { BookmarkModel } from '@/models/bookmark/bookmark.model.js';
import { WebsiteMetaModel } from '@/models/website-meta.model.js';
import { fetchWebsiteMetadata } from '@/lib/meta-scraper.js';
import { getMongoConnection, closeMongoConnection } from '@/lib/mongo-connection.js';
import { normalizeUrlSafe } from '@/utils/url.js';
import QueueLib from '@/lib/queue.js';
import redisClient from '@/lib/redis-client.js';
import { BaseWorker } from '../core/base-worker.js';

const META_CACHE_PREFIX = QueueConfig.cache.META_CACHE_PREFIX;
const CACHE_TTL = 60 * 60 * 24; // Cache for 24 hours
const TASK_NAME = QueueConfig.bookmark.fetchMeta;

class BookmarkMetaWorker extends BaseWorker {
  protected async start(): Promise<void> {
    this.logger.info('Bookmark fetch worker started');
    await getMongoConnection({});
    this.startQueueListener();
  }

  /**
   * Start listening to the queue
   */
  protected async startQueueListener() {
    this.logger.info(`[Worker] Starting to listen to the queue: ${TASK_NAME}`);

    while (this.isRunning()) {
      const task = await QueueLib.getTaskBlocking<BookmarkFetchTask>(TASK_NAME, 2);

      if (task) {
        await this.processTask(task);
      }
    }
  }

  /**
   * Get cache key
   * @param url Website URL
   */
  private getCacheKey(url: string): string {
    // Normalize URL to ensure the same URL has the same cache key
    const normalizedUrl = normalizeUrlSafe(url);
    return `${META_CACHE_PREFIX}${normalizedUrl}`;
  }

  /**
   * Check if URL metadata is cached
   * @param url Website URL
   */
  private async checkMetaCache(url: string): Promise<boolean> {
    try {
      const cacheKey = this.getCacheKey(url);
      const exists = await redisClient.exists(cacheKey);
      return exists === 1;
    } catch (error) {
      this.logger.error(`[Worker] Redis cache check error:`, error);
      return false;
    }
  }

  /**
   * Get cached metadata from the database
   * @param url Website URL
   */
  private async getMetaFromDatabase(url: string): Promise<any | null> {
    try {
      // Find the most recently successfully fetched metadata
      const meta = await WebsiteMetaModel.findOne({
        url: normalizeUrlSafe(url),
        fetchStatus: WebsiteMetaFetchEnums.SUCCESS,
      })
        .sort({ updatedAt: -1 })
        .lean();

      return meta;
    } catch (error) {
      this.logger.error(`[Worker] Error getting metadata from database:`, error);
      return null;
    }
  }

  /**
   * Add URL to cache
   * @param url Website URL
   */
  private async addUrlToCache(url: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(url);
      await redisClient.set(cacheKey, '1', 'EX', CACHE_TTL);
      this.logger.debug(`[Worker] URL added to cache: ${url}`);
    } catch (error) {
      this.logger.error(`[Worker] Redis cache add error:`, error);
    }
  }

  /**
   * Update bookmark and metadata records
   * @param bookmark Bookmark model instance
   * @param websiteMeta Website metadata model instance
   * @param metaData Metadata information
   * @param fetchStatus Fetch status
   */
  private async updateRecords(
    bookmark: any,
    websiteMeta: any,
    metaData: ErrorResult | SuccessResult,
    fetchStatus: keyof typeof WebsiteMetaFetchEnums
  ): Promise<void> {
    if (metaData.result && metaData.result.success) {
      bookmark.meta = websiteMeta._id;
      bookmark.title = metaData.result?.ogTitle ?? null;
      bookmark.description = metaData.result.ogDescription ?? null;
      bookmark.icon = metaData.result?.favicon;

      // Update metadata information
      websiteMeta.url = bookmark.url;
      websiteMeta.ogsResult = metaData.result ? JSON.stringify(metaData.result) : '';
      websiteMeta.ogsResponse = '';
      websiteMeta.ogsHtml = metaData.html;
    }

    websiteMeta.fetchStatus = fetchStatus;

    if (metaData.error) {
      websiteMeta.error = 'bookmark meta fetch failed!';
    }

    // Save updates
    await Promise.all([websiteMeta.save(), bookmark.save()]);
  }

  protected async processTask(task: BookmarkFetchTask): Promise<void> {
    const { userId, bookmarkId, metaId, url } = task;
    const bookmark = await BookmarkModel.findOne({ user: userId, _id: bookmarkId });
    const websiteMeta = await WebsiteMetaModel.findOne({ _id: metaId });

    if (!bookmark || !websiteMeta) {
      this.logger.error(`[Worker] Bookmark or bookmark metadata record does not exist: ${bookmarkId}`);
      return;
    }

    try {
      // Check if URL is cached
      const isCached = await this.checkMetaCache(url);

      if (isCached) {
        // URL is cached, get metadata from database
        this.logger.info(`[Worker] URL is cached, getting from database: ${url}`);
        const cachedMeta = await this.getMetaFromDatabase(url);

        if (cachedMeta) {
          // Update records using cached metadata
          await this.updateRecords(bookmark, websiteMeta, cachedMeta, WebsiteMetaFetchEnums.SUCCESS);
          this.logger.info(`[Worker] Successfully updated bookmark metadata using cache: ${bookmarkId}`);
          return;
        }
      }

      // Cache miss or no available cached data, perform real-time fetch
      this.logger.info(`[Worker] Cache miss, performing real-time fetch: ${url}`);
      const fetchedMeta = await fetchWebsiteMetadata(url);

      this.logger.info(`[Worker] Fetch result: ${(fetchedMeta.error, fetchedMeta.response)}`);
      if (fetchedMeta.error) {
        websiteMeta.fetchStatus = WebsiteMetaFetchEnums.FAILED;
        await websiteMeta.save();
      } else {
        await this.updateRecords(bookmark, websiteMeta, fetchedMeta, WebsiteMetaFetchEnums.SUCCESS);
        this.logger.info(`[Worker] Successfully updated bookmark metadata: ${bookmarkId}`);
        await this.addUrlToCache(url);
      }
    } catch (err: any) {
      websiteMeta.fetchStatus = WebsiteMetaFetchEnums.FAILED;
      websiteMeta.error = err.message ?? 'website meta Fetching failed';
      this.logger.error(`[Worker] Error fetching metadata: ${err.message}`);
      await websiteMeta.save();
    }
  }

  /**
   * Clear cache for a specific URL
   * @param url Website URL
   */
  public async clearUrlCache(url: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(url);
      await redisClient.del(cacheKey);
      this.logger.info(`[Worker] Cleared URL cache: ${url}`);
    } catch (error) {
      this.logger.error(`[Worker] Error clearing cache:`, error);
    }
  }

  /**
   * Clear all metadata cache
   */
  public async clearAllCache(): Promise<void> {
    try {
      const keys = await redisClient.keys(`${META_CACHE_PREFIX}*`);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        this.logger.info(`[Worker] Cleared all metadata cache (${keys.length} items)`);
      }
    } catch (error) {
      this.logger.error(`[Worker] Error clearing all cache:`, error);
    }
  }

  protected async onShutdown(): Promise<void> {
    this.logger.info('Shutting down bookmark fetch worker');
    await redisClient.quit();
    await closeMongoConnection();
  }
}

new BookmarkMetaWorker();
