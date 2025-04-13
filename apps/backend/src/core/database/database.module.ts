import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schemas from '@/db/schemas';
import { DB_PROVIDER } from './database-provider';

@Global()
@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');

        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });

        // Test database connection
        try {
          const client = await pool.connect();
          logger.log('Database connected successfully');
          client.release();
        } catch (error) {
          logger.error('Database connection failed:', error);
          throw error;
        }

        return drizzle(pool, {
          schema: schemas,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_PROVIDER],
})
export class DatabaseModule {}
