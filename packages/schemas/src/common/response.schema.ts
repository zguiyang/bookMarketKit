import { z } from 'zod';
import type { ZodTypeAny, ZodObject, ZodRawShape } from 'zod';

// 分页方向枚举
export const PaginationDirectionEnum = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// 分页默认值
export const PaginationDefaults = {
  PAGE: 1,
  PAGE_SIZE: 10,
  DIRECTION: PaginationDirectionEnum.DESC,
} as const;

/**
 * 全局通用 API 响应类型
 */
export type ApiResponse<T = any> = {
  code: number | string;
  message: string;
  data: T;
  error?: any;
};

/**
 * 分页数据类型定义
 */
export type PaginatedData<T> = {
  content: T[];
  page: number;
  pages: number;
  pageSize: number;
  total: number;
};

/**
 * 分页响应数据类型定义
 */
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

/**
 * 创建分页请求的 Schema
 */
export function createPaginatedRequestSchema<T extends ZodObject<ZodRawShape>>(
  schema: T,
  options?: {
    defaultPageSize?: number;
    defaultDirection?: typeof PaginationDirectionEnum[keyof typeof PaginationDirectionEnum];
    orderByEnum?: Record<string, string>;
  }
) {
  const {
    defaultPageSize = PaginationDefaults.PAGE_SIZE,
    defaultDirection = PaginationDefaults.DIRECTION,
    orderByEnum,
  } = options || {};

  const paginationSchema = z.object({
    // 页码：最小为1
    page: z.number()
      .int()
      .min(1)
      .default(PaginationDefaults.PAGE),

    // 每页数量：最小为1，最大为maxPageSize
    pageSize: z.number()
      .int()
      .min(1)
      .default(defaultPageSize),

    // 排序字段：如果提供了orderByEnum则限制可选值
    orderBy: orderByEnum
      ? z.enum(Object.keys(orderByEnum) as [string, ...string[]])
      : z.string().optional(),

    // 排序方向：asc或desc
    direction: z.enum([PaginationDirectionEnum.ASC, PaginationDirectionEnum.DESC])
      .default(defaultDirection)
      .optional(),
  });

  return paginationSchema.merge(schema);
}

/**
 * 创建分页响应的 Schema
 */
export function createPaginatedResponseSchema<T extends ZodTypeAny>(itemSchema: T) {
  return z.object({
    content: z.array(itemSchema),
    page: z.number().int().min(1),
    pages: z.number().int().min(0),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
  })
}

/**
 * 创建普通API响应的 Schema
 */
export function createApiResponseSchema<T extends ZodTypeAny>(dataSchema: T) {
  return z.object({
    code: z.union([z.string(), z.number()]),
    message: z.string(),
    data: dataSchema,
    error: z.any().optional(),
  });
}

export const paginatedRequestSchema = createPaginatedRequestSchema(z.object({}));

export type PaginatedRequest = z.infer<typeof paginatedRequestSchema>;