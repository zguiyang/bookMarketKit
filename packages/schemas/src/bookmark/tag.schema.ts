import { z } from 'zod';

// 标签基础Schema
export const tagResponseSchema = z.object({
  _id: z.string(),
  user: z.string(),
  name: z.string(),
  color: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const tagListResponseSchema = z.array(tagResponseSchema);

// 标签创建和更新Schema
export const createTagBodySchema = z.object({
  name: z.string().min(1, { message: '标签名称不能为空' }),
  color: z.string().optional(),
}).strict();

export const updateTagBodySchema = z.object({
  id: z.string().min(1, { message: '标签ID不能为空' }),
  name: z.string().optional(),
  color: z.string().optional(),
}).strict();

// 标签ID参数Schema
export const tagIdParamSchema = z.object({
  id: z.string().min(1, { message: '标签ID不能为空' }),
});

// 类型导出
export type TagResponse = z.infer<typeof tagResponseSchema>;
export type TagListResponse = z.infer<typeof tagListResponseSchema>;
export type CreateTagBody = z.infer<typeof createTagBodySchema>;
export type UpdateTagBody = z.infer<typeof updateTagBodySchema>;
export type TagIdParam = z.infer<typeof tagIdParamSchema>; 