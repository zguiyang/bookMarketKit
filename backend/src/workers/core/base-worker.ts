import { parentPort } from 'worker_threads';

export abstract class BaseWorker {
  private running = true;

  constructor() {
    // 设置消息处理
    parentPort?.on('message', (message) => {
      if (message === 'shutdown') {
        this.log('info', 'Received shutdown signal');
        this.shutdown()
          .then(() => process.exit(0))
          .catch((err) => {
            this.log('error', `Error during shutdown: ${err}`);
            process.exit(1);
          });
      }
    });

    // 设置进程信号处理
    process.on('SIGINT', this.handleExit.bind(this));
    process.on('SIGTERM', this.handleExit.bind(this));

    // 启动worker
    this.start().catch((err) => {
      this.log('error', `Fatal error: ${err}`);
      process.exit(1);
    });
  }

  protected log(level: 'info' | 'warn' | 'error', msg: string): void {
    parentPort?.postMessage({ type: 'log', level, msg });

    // 同时输出到控制台（便于调试）
    console[level](`[${this.constructor.name}] ${msg}`);
  }

  protected isRunning(): boolean {
    return this.running;
  }

  private async handleExit(): Promise<void> {
    this.log('info', 'Process signal received, shutting down...');
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
