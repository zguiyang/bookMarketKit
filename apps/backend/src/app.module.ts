import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response';
import { DatabaseModule } from '@/core/database/database.module';
import { JwtModule } from '@/core/jwt/jwt.module';
import { JwtAuthGuard } from '@/core/jwt/jwt-auth.guard';
import { RedisModule } from '@/core/redis/redis.modules';
import { TaskModule } from '@/modules/task/task.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { BookmarkModule } from '@/modules/bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
    }),
    DatabaseModule,
    JwtModule,
    RedisModule,
    TaskModule,

    UserModule,
    AuthModule,
    BookmarkModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
