import { Module } from '@nestjs/common';
import { JwtModule } from '@/core/jwt/jwt.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
