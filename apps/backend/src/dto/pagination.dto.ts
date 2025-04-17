import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './response.dto';

export enum PageDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageListRequest {
  @ApiProperty({
    description: '页码',
    example: 1,
    required: true,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: true,
    minimum: 1,
  })
  pageSize: number;

  @ApiProperty({
    description: '排序字段',
    example: 'createdAt',
    required: false,
  })
  orderBy?: string;

  @ApiProperty({
    description: '排序方向',
    enum: PageDirectionEnum,
    example: PageDirectionEnum.DESC,
    required: false,
  })
  direction?: PageDirectionEnum;
}

export class PageListData<T = any> {
  content: T[];
  page: number;
  pages: number;
  pageSize: number;
  total: number;
}

export type PageListResponse<T = any> = ApiResponse<PageListData<T>>;
