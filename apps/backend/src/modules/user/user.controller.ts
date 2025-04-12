import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { DrizzleValidationPipe } from '@/common/pipes/drizzle.validation';

import { UserService } from './user.service';
import { insertUserSchema } from './dto/schema.dto';
import { CreateUserDTO } from './dto/request.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(
    @Body(new DrizzleValidationPipe(insertUserSchema)) body: CreateUserDTO,
  ) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
