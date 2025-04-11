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
import {
  authRegisterSchema,
  AuthRegisterDTO,
  authLoginSchema,
  AuthLoginDTO,
} from './dto/request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Get('getEmailCode')
  async getEmailCode(@Query('email') email: string) {
    await this.authService.getEmailVerificationCode(email);
  }

  @PublicAPI()
  @Post('register')
  async register(
    @Body(new DrizzleValidationPipe(authRegisterSchema)) body: AuthRegisterDTO,
  ) {
    return this.authService.register(body);
  }

  @PublicAPI()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body(new DrizzleValidationPipe(authLoginSchema)) body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser() user: RequestUser) {
    return this.authService.logout(user);
  }
}
