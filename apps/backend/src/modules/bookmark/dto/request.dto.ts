import { ApiProperty } from '@nestjs/swagger';
import { PageListRequest } from '@/dto/pagination.dto';

export class BookmarkPageListRequestDTO extends PageListRequest {
  @ApiProperty({
    description: '书签标题',
    example: '我的书签',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: '标签ID',
    example: 'uuid-tag-id',
    required: false,
  })
  tagId?: string;

  @ApiProperty({
    description: '分类ID',
    example: 'uuid-category-id',
    required: false,
  })
  categoryId?: string;
}

export class CreateBookmarkDTO {
  @ApiProperty({
    description: '书签标题',
    example: '我的书签',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '书签URL',
    example: 'https://example.com',
    required: true,
  })
  url: string;
}

export class UpdateBookmarkDTO {
  @ApiProperty({
    description: '书签ID',
    example: 'uuid-bookmark-id',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: '书签标题',
    example: '我的书签',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: '书签URL',
    example: 'https://example.com',
    required: false,
  })
  url?: string;

  @ApiProperty({
    description: '书签描述',
    example: '这是一个很有用的网站',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '访问次数',
    example: '10',
    required: false,
  })
  visit_count?: string;

  @ApiProperty({
    description: '是否收藏（0-否，1-是）',
    example: 1,
    enum: [0, 1],
    required: false,
  })
  is_favorite?: number;

  @ApiProperty({
    description: '是否置顶（0-否，1-是）',
    example: 1,
    enum: [0, 1],
    required: false,
  })
  is_pinned?: number;

  @ApiProperty({
    description: '网站图标URL',
    example: 'https://example.com/favicon.ico',
    required: false,
  })
  favicon_url?: string;

  @ApiProperty({
    description: '网站截图URL',
    example: 'https://example.com/screenshot.png',
    required: false,
  })
  screenshot_url?: string;

  @ApiProperty({
    description: '最后访问时间',
    example: '2024-03-20T12:00:00Z',
    required: false,
  })
  last_visited_at?: string;
}

export class SetFavoriteDTO {
  @ApiProperty({
    description: '书签ID',
    example: 'uuid-bookmark-id',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: '是否收藏（0-否，1-是）',
    example: 1,
    enum: [0, 1],
    required: true,
  })
  isFavorite: 0 | 1;
}

export class SetPinnedTopDTO {
  @ApiProperty({
    description: '书签ID',
    example: 'uuid-bookmark-id',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: '是否置顶（0-否，1-是）',
    example: 1,
    enum: [0, 1],
    required: true,
  })
  isPinned: 0 | 1;
}
