import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description: '用户名',
    example: 'johndoe',
    required: true,
  })
  username: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'john@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '用户密码',
    example: 'password123',
    required: true,
    minLength: 6,
  })
  password: string;
}
