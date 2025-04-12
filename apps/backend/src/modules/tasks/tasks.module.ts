import { Module } from '@nestjs/common';
// import { ScheduleModule } from '@nestjs/schedule';
import { TasksEmailService } from './tasks.email.service';
import { MailerModule } from '@/core/mailer/mailer.module';

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    MailerModule,
  ],
  providers: [TasksEmailService],
  exports: [TasksEmailService],
})
export class TasksModule {}
