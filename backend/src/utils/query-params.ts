import type { PaginatedRequest } from '~shared/schemas';
import { PaginationDirectionEnum } from  '~shared/schemas';
import type { SortOrder } from 'mongoose';

/**
 * Filter invalid values (null, undefined, empty string) from an object
 * @param params The object to filter
 * @returns The filtered object (only contains valid values)
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
 * Extract pagination and sorting parameters
 * @param query Pagination request parameters
 * @returns Pagination and sorting related parameters
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
