import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BookMarketKit Backend')
    .setDescription('Book Market Kit Backend')
    .setVersion('1.0')
    .addTag('BookMarketKit')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入JWT token',
        in: 'header',
      },
      'jwt', // 这个是security scheme的名字，后面会用到
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  const port = 3090;
  await app.listen(port);
  Logger.log(
    `BookMarketKit Backend server is running on: http://localhost:${port}`,
  );
}

void bootstrap();
