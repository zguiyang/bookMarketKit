import { Module } from '@nestjs/common';
import { JwtModule } from '@/core/jwt/jwt.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
