import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import { HttpExceptionFilter } from '@/common/filters/http-exception';
import { DatabaseExceptionFilter } from '@/common/filters/database-exception';
import { OtherExceptionFilter } from '@/common/filters/other-exception';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DatabaseExceptionFilter(),
    new OtherExceptionFilter(),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const port = 3090;
  await app.listen(port);
  Logger.log(
    `BookMarketKit Backend server is running on: http://localhost:${port}`,
  );
}
void bootstrap();
