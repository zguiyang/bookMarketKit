import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskEmailService } from './task.email.service';
import { MailerModule } from '@/core/mailer/mailer.module';

@Module({
  imports: [ScheduleModule.forRoot(), MailerModule],
  providers: [TaskEmailService],
  exports: [TaskEmailService],
})
export class TaskModule {}
