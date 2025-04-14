import { ApiResponse } from './response';

export enum PageDirectionEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface PageListRequest {
    page: number;
    pageSize: number;
    orderBy?: string;
    direction?: PageDirectionEnum;
}
export interface PageListData<T = any> {
    content: T[];
    page: number;
    pages: number;
    pageSize: number;
    total: number;
}
export type PageListResponse<T = any> = ApiResponse<PageListData<T>>;