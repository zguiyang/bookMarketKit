import { PaginatedRequest, PaginationDirectionEnum } from '@bookmark/schemas';
import { SortOrder } from 'mongoose';

/**
 * 过滤对象中的无效值（null、undefined、空字符串）
 * @param params 需要过滤的对象
 * @returns 过滤后的对象（只包含有效值）
 */
export function filterNullOrUndefined<T extends Record<string, any>>(params: T): Partial<T> {
  if (!params || typeof params !== 'object') {
    return {};
  }

  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * 提取分页与排序参数
 * @param query 分页请求参数
 * @returns 分页与排序相关参数
 */
export function getPaginateOptions(query: PaginatedRequest) {
  const { page, pageSize, orderBy, direction } = query;
  const skip = (page - 1) * pageSize;
  let sort: string | { [key: string]: SortOrder } = { createdAt: -1 };
  if (orderBy) {
    sort = { [orderBy]: direction ?? PaginationDirectionEnum.DESC } as { [key: string]: SortOrder };
  }
  return { page, pageSize, skip, sort };
}
