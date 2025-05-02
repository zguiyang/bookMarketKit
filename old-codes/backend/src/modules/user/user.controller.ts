import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/request.dto';

@ApiTags('用户管理')
@ApiBearerAuth('jwt')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建新用户', description: '创建一个新的用户账号' })
  @ApiResponse({ status: 201, description: '用户创建成功' })
  @ApiResponse({ status: 400, description: '用户已存在或参数错误' })
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: '获取所有用户',
    description: '获取系统中所有用户的列表',
  })
  @ApiResponse({ status: 200, description: '成功获取用户列表' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '获取指定用户',
    description: '根据用户ID获取用户信息',
  })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '成功获取用户信息' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
