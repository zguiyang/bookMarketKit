import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { MailerModule } from './mailer.module';
import { ConfigModule } from '@nestjs/config';

describe('MailerService', () => {
  let service: MailerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // 加载环境变量配置
        await ConfigModule.forRoot({
          envFilePath: '.env.development',
        }),
        MailerModule,
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  describe('邮件发送测试', () => {
    const testEmail = '2770723534@qq.com'; // 替换为您的测试邮箱
    const testCode = '123456';

    it(
      '应该能成功发送验证码邮件',
      async () => {
        console.log('开始发送测试邮件...');
        const result = await service.sendVerificationCode(testEmail, testCode);
        console.log('邮件发送结果:', result);

        // 验证是否成功返回验证码
        expect(result).toBe(testCode);
      },
      1000 * 60,
    );

    it(
      '应该能成功发送自定义邮件',
      async () => {
        const result = await service.sendCustomEmail(
          testEmail,
          '测试邮件',
          'verification-code',
          {
            code: testCode,
            expireTime: '5分钟',
          },
        );

        expect(result).toBeTruthy();
      },
      1000 * 60,
    );
  });
});
