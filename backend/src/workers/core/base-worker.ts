import { parentPort } from 'worker_threads';
import Logger from '@/utils/logger';

export abstract class BaseWorker {
  private running = true;
  public logger = Logger;

  constructor() {
    // Set up message handling
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

    // Set up process signal handling
    process.on('SIGINT', this.handleExit.bind(this));
    process.on('SIGTERM', this.handleExit.bind(this));

    // Start the worker
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

  // Methods to be implemented by subclasses
  protected abstract start(): Promise<void>;
  protected abstract onShutdown(): Promise<void>;
}
