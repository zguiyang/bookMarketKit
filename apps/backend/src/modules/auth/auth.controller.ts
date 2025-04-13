import {
  Controller,
  Post,
  Body,
  HttpCode,
  Delete,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { PublicAPI } from '@/common/decorator/public.decorator';
import { CurrentUser } from '@/common/decorator/get-user.decorator';
import { RequestUser } from '@/dto/request.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO, AuthLoginDTO } from './dto/request.dto';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Get('getEmailCode')
  @ApiOperation({
    summary: '获取邮箱验证码',
    description: '发送验证码到指定邮箱',
  })
  @ApiQuery({ name: 'email', description: '邮箱地址', required: true })
  @ApiResponse({ status: 200, description: '验证码发送成功' })
  @ApiResponse({ status: 400, description: '邮箱格式错误或发送频率过高' })
  async getEmailCode(@Query('email') email: string) {
    return await this.authService.getEmailVerificationCode(email);
  }

  @PublicAPI()
  @Post('register')
  @ApiOperation({ summary: '用户注册', description: '创建新用户账号' })
  @ApiBody({ type: AuthRegisterDTO })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '注册失败，用户已存在或验证码错误' })
  async register(@Body() body: AuthRegisterDTO) {
    return await this.authService.register(body);
  }

  @PublicAPI()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录', description: '用户登录并获取访问令牌' })
  @ApiBody({ type: AuthLoginDTO })
  @ApiResponse({ status: 200, description: '登录成功，返回访问令牌' })
  @ApiResponse({ status: 401, description: '登录失败，邮箱或密码错误' })
  async login(@Body() body: AuthLoginDTO) {
    return await this.authService.login(body);
  }

  @Get('currentUser')
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '获取当前用户信息',
    description: '获取当前登录用户的详细信息',
  })
  @ApiResponse({ status: 200, description: '成功获取用户信息' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getCurrentUser(@CurrentUser() user: RequestUser) {
    return await this.authService.getCurrentUser(user);
  }

  @Delete('logout')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登出', description: '注销当前用户的登录状态' })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async logout(@CurrentUser() user: RequestUser) {
    return await this.authService.logout(user);
  }
}
