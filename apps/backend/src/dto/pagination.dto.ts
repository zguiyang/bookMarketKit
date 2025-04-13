import { ApiResponse } from './response.dto';
export enum PageDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageListRequest {
  page: number;
  pageSize: number;
  orderBy?: string;
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
