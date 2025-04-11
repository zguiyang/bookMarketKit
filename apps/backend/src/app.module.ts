import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/core/database/database.module';
import { ResponseModule } from '@/core/response/response.module';
import { JwtModule } from '@/core/jwt/jwt.module';
import { RedisModule } from '@/core/redis/redis.modules';
import { SchedulerModule } from '@/modules/scheduler/scheduler.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
    }),
    DatabaseModule,
    JwtModule,
    RedisModule,
    ResponseModule,
    SchedulerModule,

    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
