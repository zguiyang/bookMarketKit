import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly nestMailerService: NestMailerService) {}
  logger = new Logger(MailerService.name);

  /**
   * 发送验证码邮件
   * @param to 收件人邮箱
   * @param code 验证码
   * @returns 发送结果
   */
  async sendVerificationCode(to: string, code: string) {
    try {
      await this.nestMailerService.sendMail({
        to,
        subject: '验证码',
        template: 'verification-code',
        context: {
          code,
          expireTime: '10分钟',
        },
      });
      return code;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  /**
   * 发送自定义邮件
   * @param to 收件人邮箱
   * @param subject 邮件主题
   * @param template 模板名称
   * @param context 模板上下文
   * @returns 发送结果
   */
  async sendCustomEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ) {
    try {
      return await this.nestMailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
