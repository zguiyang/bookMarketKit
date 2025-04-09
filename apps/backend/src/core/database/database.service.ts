import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schemas from '~/db/schemas';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public db: NodePgDatabase<typeof schemas>;
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing db connection...');
      this.pool = new Pool({
        connectionString: this.configService.getOrThrow('DATABASE_URL'),
      });

      // 测试数据库连接
      await this.pool.query('SELECT 1');
      this.logger.log('Database connection established successfully.');

      this.db = drizzle(this.pool, {
        schema: {
          ...schemas,
        },
      });
    } catch (error) {
      this.logger.error('Failed to initialize db connection.', error);
      throw new Error(
        'Database connection failed. Please check your configuration.',
      );
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      this.logger.log('Closing db connection...');
      await this.pool.end();
      this.logger.log('Database connection closed.');
    }
  }
}
