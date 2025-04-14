import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDTO {
  @ApiProperty({
    description: '标签名称',
    example: '技术',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: '标签颜色',
    example: '#FF0000',
    required: false,
  })
  color?: string;
}

export class UpdateTagDTO {
  @ApiProperty({
    description: '标签ID',
    example: 'uuid-tag-id',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: '标签名称',
    example: '技术',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '标签颜色',
    example: '#FF0000',
    required: false,
  })
  color?: string;
}
