import { CronJob } from 'cron';
import type { FilterQuery } from 'mongoose';
import path from 'path';

import * as uploadCfg from '@/config/upload.config.js';
import { FileModel } from '@/models/file.model.js';
import type { IFileDocument } from '@/models/file.model.js';
import { StorageTypeEnums } from '~shared/schemas';
import { getMongoConnection, closeMongoConnection } from '@/lib/mongo-connection.js';
import * as fileUtil from '@/utils/file.js';
import { BaseWorker } from '../core/base-worker.js';

class FileWorker extends BaseWorker {
  protected async start(): Promise<void> {
    this.logger.info('File worker started');
    await getMongoConnection();
    await this.startCronJob();
  }
  protected async onShutdown(): Promise<void> {
    this.logger.info('Shutting down file worker');
    await closeMongoConnection();
  }
  protected async startCronJob(): Promise<void> {
    this.logger.info('Starting cron job for file worker');
    const job = new CronJob('0 2 * * *', async () => {
      this.logger.info('Running temp file remove task...');
      await this.removeOldTempFiles();
    });
    job.start();
  }

  /**
   * Find temporary files that were created more than one day ago
   * @returns Array of file documents that match the criteria
   */
  protected async removeOldTempFiles(): Promise<void> {
    // 计算一天前的时间
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const query: FilterQuery<IFileDocument> = {
      storageType: StorageTypeEnums.TEMP,
      createdAt: { $lt: oneDayAgo },
    };

    // 执行查询
    const oldTempFiles = await FileModel.find(query);
    console.log(oldTempFiles);

    this.logger.info(`Found ${oldTempFiles.length} temporary files older than one day`);

    for (const file of oldTempFiles) {
      const fullPath = path.join(uploadCfg.STATIC_ROOT_DIR, file.path);
      await fileUtil.removeFile(fullPath);
      await file.deleteOne();
    }
  }
}

new FileWorker();
