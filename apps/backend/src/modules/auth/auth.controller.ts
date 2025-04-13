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

import { PublicAPI } from '@/common/decorator/public.decorator';
import { CurrentUser } from '@/common/decorator/get-user.decorator';
import { RequestUser } from '@/dto/request.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO, AuthLoginDTO } from './dto/request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Get('getEmailCode')
  async getEmailCode(@Query('email') email: string) {
    return await this.authService.getEmailVerificationCode(email);
  }

  @PublicAPI()
  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return await this.authService.register(body);
  }

  @PublicAPI()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthLoginDTO) {
    return await this.authService.login(body);
  }

  @Get('currentUser')
  async getCurrentUser(@CurrentUser() user: RequestUser) {
    return await this.authService.getCurrentUser(user);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: RequestUser) {
    return await this.authService.logout(user);
  }
}
