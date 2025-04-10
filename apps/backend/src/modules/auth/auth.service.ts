import { Injectable } from '@nestjs/common';

import { comparePassword } from '@/shared/bcrypt';
import { JwtService } from '@/core/jwt/jwt.service';
import { RedisService } from '@/core/redis/redis.service';
import { ResponseService } from '@/core/response/response.service';
import { UsersService } from '../users/users.service';
import { LoginParamsDTO } from './dto/request.dto';

import { usersCodeMessages } from '@/settings/code-message.setting';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly responseService: ResponseService,
  ) {}

  /**
   * user login
   * @param { LoginParamsDTO } params - login params
   * * **/
  async login(params: LoginParamsDTO) {
    const { email, password } = params;
    const user = await this.usersService.findUserByFields('email', email);
    if (!user) {
      return this.responseService.error(usersCodeMessages.notFoundUser);
    }

    const checkedPassword = await comparePassword(password, user.password);

    if (!checkedPassword) {
      return {
        success: false,
        code: 'LOGIN_FAILED',
        message: '密码错误，登录失败',
      };
    }

    const accessToken = this.jwtService.generateAccessToken({
      email: user.email,
      userId: user.id,
    });
    /* 
    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      type: 'REFRESH',
    }) */

    await this.redisService.setAssessToken(user.email, accessToken);

    return {
      message: '登录成功',
      code: 'LOGIN_SUCCESS',
      data: {
        accessToken,
        refreshToken: null,
      },
    };
  }

  async refreshToken() {
    // TODO: 刷新token
  }

  async logout() {
    // TODO: 登出
  }
}
