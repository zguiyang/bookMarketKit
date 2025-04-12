import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HttpExceptionFilter } from '@/common/filters/http-exception';
import { DatabaseExceptionFilter } from '@/common/filters/database-exception';
import { OtherExceptionFilter } from '@/common/filters/other-exception';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response';
import { DatabaseModule } from '@/core/database/database.module';
import { ResponseModule } from '@/core/response/response.module';
import { JwtModule } from '@/core/jwt/jwt.module';
import { JwtAuthGuard } from '@/core/jwt/jwt-auth.guard';
import { RedisModule } from '@/core/redis/redis.modules';
import { TaskModule } from '@/modules/task/task.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { BookmarkModule } from '@/modules/bookmark/bookmark.module';

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
    TaskModule,

    UserModule,
    AuthModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OtherExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
