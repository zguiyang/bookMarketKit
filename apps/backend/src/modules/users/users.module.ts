import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ResponseModule } from '@/core/response/response.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ResponseModule],
  exports: [UsersService],
})
export class UsersModule {}
