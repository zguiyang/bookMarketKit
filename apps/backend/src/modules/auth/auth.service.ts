import { Injectable, Logger } from '@nestjs/common';

import { comparePassword } from '@/shared/bcrypt';
import { JwtService } from '@/core/jwt/jwt.service';
import { RedisService } from '@/core/redis/redis.service';
import { ResponseService } from '@/core/response/response.service';
import { generateRandomCode } from '@/shared/code';
import { UsersService } from '@/modules/users/users.service';
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly responseService: ResponseService,
  ) {}

  async register(data: AuthRegisterDTO) {
    const { username, email, password, emailCode } = data;
    const emailCodeValidateRes = await this.verifyEmailCode(email, emailCode);
    if (emailCodeValidateRes) {
      return this.responseService.error(authCodeMessages.emailCodeError);
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
      return this.responseService.error(usersCodeMessages.notFoundUser);
    }

    const checkedPassword = await comparePassword(password, user.password);

    if (!checkedPassword) {
      return this.responseService.error(authCodeMessages.passwordError);
    }

    const accessToken = this.jwtService.generateAccessToken({
      email: user.email,
      userId: user.id,
    });

    await this.redisService.setAssessToken(user.email, accessToken);

    return this.responseService.success({
      data: {
        accessToken,
      },
    });
  }

  async logout({ email }: RequestUser) {
    return await this.redisService.removeAssessToken(email);
  }

  async getEmailVerificationCode(email: string): Promise<void> {
    // 生成6位数字验证码
    const code = generateRandomCode(6);

    // 将验证码保存到Redis，设置5分钟过期
    const key = `${redisConstants.EMAIL_CODE_PREFIX}${email}`;
    await this.redisService.set(key, code, 5 * 60);

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
