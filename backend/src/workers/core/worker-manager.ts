import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs/promises';
import type { FastifyInstance, FastifyBaseLogger } from 'fastify';
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
    // Set the path for worker-loader.mjs
    this.workerLoaderPath = path.resolve(__dirname, 'worker-loader.mjs');
  }

  async startAll(): Promise<void> {
    try {
      // Recursively get all worker files
      const workerFiles = await this.findWorkerFiles(this.workerDir);

      if (workerFiles.length === 0) {
        this.logger.warn(`No worker files found in ${this.workerDir}`);
        return;
      }

      // Start each worker
      for (const filePath of workerFiles) {
        // Extract worker name from the full path, preserving directory structure as namespace
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
   * Recursively find all worker files in a directory
   */
  private async findWorkerFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const subDirFiles = await this.findWorkerFiles(fullPath);
        files.push(...subDirFiles);
      } else if (entry.isFile() && (entry.name.endsWith('.worker.js') || entry.name.endsWith('.worker.ts'))) {
        // Add worker file
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Generate worker name based on file path
   * Example: tasks/bookmark/bookmark.website.worker.ts -> tasks.bookmark.bookmark.website
   */
  private generateWorkerName(relativePath: string): string {
    // Remove file extension
    const nameWithoutExt = relativePath.replace(/\.(js|ts)$/, '');

    // Remove .worker suffix
    const nameWithoutWorkerSuffix = nameWithoutExt.replace(/\.worker$/, '');

    // Replace path separators with dots to create a namespace
    // Example: tasks/bookmark/bookmark.website -> tasks.bookmark.bookmark.website
    return nameWithoutWorkerSuffix.replace(/[\\/]/g, '.');
  }

  async startWorker(name: string, filePath: string): Promise<void> {
    try {
      // Check if the worker is already running
      if (this.workers.has(name)) {
        this.logger.warn(`Worker ${name} is already running`);
        return;
      }

      this.logger.info(`Starting worker: ${name} (${filePath})`);

      const isTypeScriptFile = filePath.endsWith('.ts');
      let worker: Worker;

      if (isTypeScriptFile) {
        // Use worker-loader.mjs to start TypeScript worker
        worker = new Worker(this.workerLoaderPath, {
          workerData: {
            workerFile: filePath,
            workerName: name,
          },
        });
      } else {
        // Directly start JavaScript worker
        worker = new Worker(filePath);
      }

      // Store worker information
      this.workers.set(name, { name, worker, filePath });

      // Set event listeners
      worker.on('error', (err) => {
        this.logger.error(`Worker ${name} error: ${err}`);
        this.workers.delete(name);
        // Auto-restart
        setTimeout(() => this.startWorker(name, filePath), 5000);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          this.logger.warn(`Worker ${name} exited with code ${code}`);
          this.workers.delete(name);
          // Auto-restart
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

        // Set a timeout to prevent the worker from not responding
        const timeout = setTimeout(() => {
          this.logger.warn(`Worker ${name} did not respond to shutdown signal, terminating...`);
          worker.terminate();
          resolve();
        }, 5000);

        // Listen for normal exit
        worker.once('exit', () => {
          clearTimeout(timeout);
          this.logger.info(`Worker ${name} stopped successfully`);
          resolve();
        });

        // Send shutdown signal
        worker.postMessage('shutdown');
      });
    });

    await Promise.all(shutdownPromises);
    this.workers.clear();
    this.logger.info('All workers stopped');
  }

  /**
   * Get information for all running workers
   */
  getWorkers(): Map<string, WorkerInfo> {
    return new Map(this.workers);
  }

  /**
   * Get a specific worker
   */
  getWorker(name: string): WorkerInfo | undefined {
    return this.workers.get(name);
  }
}
