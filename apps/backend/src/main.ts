import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@/common/filters/http-exception';
import { DatabaseExceptionFilter } from '@/common/filters/database-exception';
import { OtherExceptionFilter } from '@/common/filters/other-exception';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BookMarketKit API')
    .setDescription('The BookMarketKit API description')
    .setVersion('1.0')
    .addTag('BookMarketKit')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

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
