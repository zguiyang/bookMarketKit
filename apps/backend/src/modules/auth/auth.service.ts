import { Injectable, Logger } from '@nestjs/common';

import { comparePassword } from '@/shared/bcrypt';
import { JwtService } from '@/core/jwt/jwt.service';
import { RedisService } from '@/core/redis/redis.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { generateRandomCode } from '@/shared/code';
import { UserService } from '@/modules/user/user.service';
import { RequestUser } from '@/dto/request.dto';
import { AuthRegisterDTO, AuthLoginDTO } from './dto/request.dto';

import {
  authCodeMessages,
  usersCodeMessages,
} from '@/settings/code-message.setting';
import {
  queueMessageConstants,
  redisConstants,
} from '@/settings/constant.setting';

import { emailSettings } from '@/settings/system.setting';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async register(data: AuthRegisterDTO) {
    const { username, email, password, emailCode } = data;
    const emailCodeValidateRes = await this.verifyEmailCode(email, emailCode);
    if (!emailCodeValidateRes) {
      throw new BusinessException(authCodeMessages.emailCodeError);
    }

    return await this.usersService.create({
      username,
      email,
      password,
    });
  }

  async login(data: AuthLoginDTO) {
    const { email, password } = data;
    const user = await this.usersService.findUserByFields('email', email);
    if (!user) {
      throw new BusinessException(usersCodeMessages.notFoundUser);
    }

    const checkedPassword = await comparePassword(password, user.password);

    if (!checkedPassword) {
      throw new BusinessException(authCodeMessages.passwordError);
    }

    const accessToken = this.jwtService.generateAccessToken({
      email: user.email,
      userId: user.id,
    });

    await this.redisService.setAssessToken(user.email, accessToken);

    return accessToken;
  }

  async logout({ email }: RequestUser) {
    return await this.redisService.removeAssessToken(email);
  }

  async getEmailVerificationCode(email: string) {
    if (!email) {
      throw new BusinessException(authCodeMessages.emailNotFound);
    }

    const codeKey = `${redisConstants.EMAIL_CODE_PREFIX}${email}`;
    const rateLimitKey = `${redisConstants.EMAIL_RATE_LIMIT_PREFIX}${email}`;

    // 检查发送频率限制
    const lastSentTime = await this.redisService.get(rateLimitKey);
    if (lastSentTime) {
      throw new BusinessException(authCodeMessages.emailCodeTooFrequent);
    }

    // 生成6位数字验证码
    const code = generateRandomCode(6);

    // 将验证码保存到Redis，设置3分钟过期
    await this.redisService.set(codeKey, code, emailSettings.emailCodeExpire);

    // 设置发送频率限制, 1分钟
    await this.redisService.set(rateLimitKey, new Date().toISOString(), 60);

    // 将发送任务加入队列
    await this.redisService.pushToQueue(
      queueMessageConstants.EMAIL_VERIFICATION_QUEUE,
      {
        email,
        code,
        timestamp: new Date().toISOString(),
      },
    );

    this.logger.log(`验证码已生成并加入发送队列: ${email}`);
  }

  async getCurrentUser({ userId }: RequestUser) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new BusinessException(usersCodeMessages.notFoundUser);
    }
    const authToken = await this.redisService.getAssessToken(user.email);
    return {
      ...user,
      authToken,
    };
  }

  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    const key = `${redisConstants.EMAIL_CODE_PREFIX}${email}`;
    const savedCode = await this.redisService.get(key);

    if (!savedCode) {
      return false;
    }

    const isValid = savedCode === code;
    if (isValid) {
      // 验证成功后删除验证码
      await this.redisService.del(key);
    }

    return isValid;
  }
}
