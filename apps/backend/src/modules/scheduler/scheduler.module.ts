import { Module } from '@nestjs/common';
import { SchedulerEmailService } from './scheduler.email.service';
import { MailerModule } from '@/core/mailer/mailer.module';

@Module({
  imports: [MailerModule],
  providers: [SchedulerEmailService],
  exports: [SchedulerEmailService],
})
export class SchedulerModule {}
