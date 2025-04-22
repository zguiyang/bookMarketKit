import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { RedisService } from '@/core/redis/redis.service';
import { MailerService } from '@/core/mailer/mailer.service';

import { queueMessageConstants } from '@/settings/constant.setting';

@Injectable()
export class TaskEmailService {
  private readonly logger = new Logger(TaskEmailService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 处理邮件发送队列
   * 每秒执行一次
   */
  @Cron('*/1 * * * * *', {
    name: 'processEmailQueue',
  })
  async processEmailQueue() {
    const message = await this.redisService.popFromQueue(
      queueMessageConstants.EMAIL_VERIFICATION_QUEUE,
    );
    if (message) {
      await this.processEmailVerification(message);
    }
  }

  /**
   * 处理邮件验证码发送
   * @param message 队列消息
   * @private
   */
  private async processEmailVerification(message: any) {
    try {
      const { email, code } = message;
      await this.mailerService.sendVerificationCode(email, code);
      this.logger.log(`验证码发送成功: ${email}`);
    } catch (error) {
      this.logger.error('验证码发送失败', error.stack);
      // TODO: 可以考虑实现重试机制或将失败消息写入死信队列
    }
  }
}
