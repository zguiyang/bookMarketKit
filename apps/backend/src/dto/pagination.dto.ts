import { ApiResponse } from './response.dto';
export enum PageDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface PageListRequestDto {
  page: number;
  pageSize: number;
  orderBy?: string;
  direction?: PageDirectionEnum;
}
export interface PageListDataDto<T = any> {
  content: T[];
  page: number;
  pages: number;
  pageSize: number;
  total: number;
}
export type PageListResponseDto<T = any> = ApiResponse<PageListDataDto<T>>;
