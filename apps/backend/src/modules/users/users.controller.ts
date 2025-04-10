import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { DrizzleValidationPipe } from '@/common/pipes/drizzle.validation';

import { UsersService } from './users.service';
import { insertUserSchema } from './dto/schema.dto';
import { CreateUserDTO } from './dto/request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
