import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = 3090;
  await app.listen(port);
  Logger.log(
    `BookMarketKit Backend server is running on: http://localhost:${port}`,
  );
}
void bootstrap();
