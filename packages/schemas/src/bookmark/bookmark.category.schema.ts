import { z } from 'zod';

// 分类基础Schema
export const categoryResponseSchema = z.object({
  _id: z.string(),
  user: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  parent: z.string().nullable().default(null),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const categoryListResponseSchema = z.array(categoryResponseSchema);

// 分类创建和更新Schema
export const createCategoryBodySchema = z
  .object({
    name: z.string().min(1, { message: '分类名称不能为空' }),
    description: z.string().optional(),
    icon: z.string().optional(),
    parent: z.string().nullable().optional(),
  })
  .strict();

export const updateCategoryBodySchema = z
  .object({
    id: z.string().min(1, { message: '分类ID不能为空' }),
  })
  .merge(createCategoryBodySchema)
  .strict();

// 分类ID参数Schema
export const categoryIdParamSchema = z.object({
  id: z.string().min(1, { message: '分类ID不能为空' }),
});

// 类型导出
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;
export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
