import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as path from 'path';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const emailUser = configService.get<string>('MAILER_USER');
        const emailPassword = configService.get('MAILER_PASSWORD');
        return {
          transport: {
            host: 'smtp.qq.com',
            port: 465,
            auth: {
              user: emailUser,
              pass: emailPassword,
            },
          },
          defaults: {
            from: `"BookMarketKit" ${emailUser}`,
          },
          template: {
            dir: path.join(__dirname, '.', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
