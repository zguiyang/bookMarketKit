import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDTO {
  @ApiProperty({
    description: '分类名称',
    example: '前端开发',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: '分类描述',
    example: '前端开发相关的书签',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '分类图标',
    example: 'icon-frontend',
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: '父分类ID',
    example: 'uuid-parent-category-id',
    required: false,
  })
  parentId?: string;
}

export class UpdateCategoryDTO {
  @ApiProperty({
    description: '分类ID',
    example: 'uuid-category-id',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: '分类名称',
    example: '前端开发',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '分类描述',
    example: '前端开发相关的书签',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '分类图标',
    example: 'icon-frontend',
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: '父分类ID',
    example: 'uuid-parent-category-id',
    required: false,
  })
  parentId?: string;
}
