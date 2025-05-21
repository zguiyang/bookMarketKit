import { parentPort } from 'worker_threads';
import Logger from '@/utils/logger';

export abstract class BaseWorker {
  private running = true;
  public logger = Logger;

  constructor() {
    // 设置消息处理
    parentPort?.on('message', (message) => {
      if (message === 'shutdown') {
        this.logger.info('Received shutdown signal');
        this.shutdown()
          .then(() => process.exit(0))
          .catch((err) => {
            this.logger.error(`Error during shutdown: ${err}`);
            process.exit(1);
          });
      }
    });

    // 设置进程信号处理
    process.on('SIGINT', this.handleExit.bind(this));
    process.on('SIGTERM', this.handleExit.bind(this));

    // 启动worker
    this.start().catch((err) => {
      this.logger.error(`Fatal error: ${err}`);
      process.exit(1);
    });
  }
  protected isRunning(): boolean {
    return this.running;
  }

  private async handleExit(): Promise<void> {
    this.logger.info('Process signal received, shutting down...');
    await this.shutdown();
    process.exit(0);
  }

  protected async shutdown(): Promise<void> {
    this.running = false;
    await this.onShutdown();
  }

  // 子类需要实现的方法
  protected abstract start(): Promise<void>;
  protected abstract onShutdown(): Promise<void>;
}
