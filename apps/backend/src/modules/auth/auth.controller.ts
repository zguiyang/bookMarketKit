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

import { DrizzleValidationPipe } from '@/common/pipes/drizzle.validation';
import { PublicAPI } from '@/common/decorator/public.decorator';
import { GetCurrentUser } from '@/common/decorator/get-user.decorator';
import { RequestUser } from '@/dto/request.dto';
import { AuthService } from './auth.service';
import {
  authRegisterSchema,
  AuthRegisterDTO,
  authLoginSchema,
  AuthLoginDTO,
} from './dto/request.dto';

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
  async register(
    @Body(new DrizzleValidationPipe(authRegisterSchema)) body: AuthRegisterDTO,
  ) {
    return await this.authService.register(body);
  }

  @PublicAPI()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new DrizzleValidationPipe(authLoginSchema)) body: AuthLoginDTO,
  ) {
    return await this.authService.login(body);
  }

  @Get('currentUser')
  async getCurrentUser(@GetCurrentUser() user: RequestUser) {
    return await this.authService.getCurrentUser(user);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUser() user: RequestUser) {
    return await this.authService.logout(user);
  }
}
