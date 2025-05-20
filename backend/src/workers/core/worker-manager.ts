import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs/promises';
import { FastifyInstance, FastifyBaseLogger } from 'fastify';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface WorkerInfo {
  name: string;
  worker: Worker;
  filePath: string;
}

export class WorkerManager {
  private workers: Map<string, WorkerInfo> = new Map();
  private logger: FastifyBaseLogger;
  private workerDir: string;
  private workerLoaderPath: string;

  constructor(fastify: FastifyInstance, workerDir: string) {
    this.logger = fastify.log;
    this.workerDir = workerDir;
    // 设置 worker-loader.mjs 的路径
    this.workerLoaderPath = path.resolve(__dirname, 'worker-loader.mjs');
  }

  async startAll(): Promise<void> {
    try {
      // 递归获取所有worker文件
      const workerFiles = await this.findWorkerFiles(this.workerDir);

      if (workerFiles.length === 0) {
        this.logger.warn(`No worker files found in ${this.workerDir}`);
        return;
      }

      // 启动每个worker
      for (const filePath of workerFiles) {
        // 从完整路径中提取worker名称，保留目录结构作为命名空间
        const relativePath = path.relative(this.workerDir, filePath);
        const workerName = this.generateWorkerName(relativePath);
        await this.startWorker(workerName, filePath);
      }

      this.logger.info(`Started ${this.workers.size} workers`);
    } catch (error) {
      this.logger.error(`Failed to start workers: ${error}`);
      throw error;
    }
  }

  /**
   * 递归查找目录中的所有worker文件
   */
  private async findWorkerFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // 递归处理子目录
        const subDirFiles = await this.findWorkerFiles(fullPath);
        files.push(...subDirFiles);
      } else if (entry.isFile() && (entry.name.endsWith('.worker.js') || entry.name.endsWith('.worker.ts'))) {
        // 添加worker文件
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * 根据文件路径生成worker名称
   * 例如: tasks/bookmark/bookmark.meta.worker.ts -> bookmark.meta
   */
  private generateWorkerName(relativePath: string): string {
    // 移除文件扩展名
    const nameWithoutExt = relativePath.replace(/\.(js|ts)$/, '');

    // 移除.worker后缀
    const nameWithoutWorkerSuffix = nameWithoutExt.replace(/\.worker$/, '');

    // 将路径分隔符替换为点，创建命名空间
    // 例如: tasks/bookmark/bookmark.meta -> tasks.bookmark.bookmark.meta
    return nameWithoutWorkerSuffix.replace(/[\\/]/g, '.');
  }

  async startWorker(name: string, filePath: string): Promise<void> {
    try {
      // 检查worker是否已经在运行
      if (this.workers.has(name)) {
        this.logger.warn(`Worker ${name} is already running`);
        return;
      }

      this.logger.info(`Starting worker: ${name} (${filePath})`);

      const isTypeScriptFile = filePath.endsWith('.ts');
      let worker: Worker;

      if (isTypeScriptFile) {
        // 使用 worker-loader.mjs 启动 TypeScript worker
        worker = new Worker(this.workerLoaderPath, {
          workerData: {
            workerFile: filePath,
            workerName: name,
          },
        });
      } else {
        // 直接启动 JavaScript worker
        worker = new Worker(filePath);
      }

      // 存储worker信息
      this.workers.set(name, { name, worker, filePath });

      // 设置事件监听器
      worker.on('error', (err) => {
        this.logger.error(`Worker ${name} error: ${err}`);
        this.workers.delete(name);
        // 自动重启
        setTimeout(() => this.startWorker(name, filePath), 5000);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          this.logger.warn(`Worker ${name} exited with code ${code}`);
          this.workers.delete(name);
          // 自动重启
          setTimeout(() => this.startWorker(name, filePath), 5000);
        } else {
          this.logger.info(`Worker ${name} exited gracefully`);
          this.workers.delete(name);
        }
      });

      worker.on('message', (message) => {
        if (message.type === 'log') {
          const { level, msg } = message;
          // @ts-ignore
          this.logger[level](`[Worker ${name}] ${msg}`);
        }
      });

      this.logger.info(`Worker ${name} started successfully`);
    } catch (error) {
      this.logger.error(`Failed to start worker ${name}: ${error}`);
      throw error;
    }
  }

  async stopAll(): Promise<void> {
    const shutdownPromises = Array.from(this.workers.values()).map(({ name, worker }) => {
      return new Promise<void>((resolve) => {
        this.logger.info(`Stopping worker: ${name}`);

        // 设置超时，防止worker无响应
        const timeout = setTimeout(() => {
          this.logger.warn(`Worker ${name} did not respond to shutdown signal, terminating...`);
          worker.terminate();
          resolve();
        }, 5000);

        // 监听正常退出
        worker.once('exit', () => {
          clearTimeout(timeout);
          this.logger.info(`Worker ${name} stopped successfully`);
          resolve();
        });

        // 发送关闭信号
        worker.postMessage('shutdown');
      });
    });

    await Promise.all(shutdownPromises);
    this.workers.clear();
    this.logger.info('All workers stopped');
  }

  /**
   * 获取所有运行中的worker信息
   */
  getWorkers(): Map<string, WorkerInfo> {
    return new Map(this.workers);
  }

  /**
   * 获取特定worker
   */
  getWorker(name: string): WorkerInfo | undefined {
    return this.workers.get(name);
  }
}
