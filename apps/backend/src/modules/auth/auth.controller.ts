import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { DrizzleValidationPipe } from '@/common/pipes/drizzle.validation';
import { PublicAPI } from '@/common/decorator/public.decorator';
import { LoginParamsSchema, LoginParamsDTO } from './dto/request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body(new DrizzleValidationPipe(LoginParamsSchema)) body: LoginParamsDTO,
  ) {
    return this.authService.login(body);
  }
}
