import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { mailerConfig } from './mailer.config';

@Module({
  imports: [NestMailerModule.forRoot(mailerConfig)],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
