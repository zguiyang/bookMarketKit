import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from 'drizzle-zod';
import { z } from 'zod';

import { bookmarksTable } from '@/db/schemas';

export const insertBookmarkSchema = createInsertSchema(bookmarksTable, {
  url: z
    .string({
      message: '书签URL为必填项',
    })
    .url({ message: '请输入正确的URL' }),
  title: z
    .string({
      message: '书签标题为必填项',
    })
    .min(1, { message: '标题不能为空' })
    .max(255, { message: '标题不能大于255字符' }),
});

export const updateBookmarkSchema = createUpdateSchema(bookmarksTable, {
  url: z.string().url({ message: '请输入正确的URL' }).optional(),
  title: z
    .string()
    .min(1, { message: '标题不能为空' })
    .max(255, { message: '标题不能大于255字符' })
    .optional(),
}).merge(
  z.object({
    id: z
      .string({
        required_error: '书签ID不能为空',
      })
      .uuid({
        message: '书签ID格式错误',
      }),
    is_favorite: z.number().optional(),
    is_pinned: z.number().optional(),
    favicon_url: z.string().optional(),
    screenshot_url: z.string().optional(),
    last_visited_at: z.string().optional(),
    visit_count: z.number().optional(),
    description: z.string().optional(),
  }),
);

export const selectBookmarkSchema = createSelectSchema(bookmarksTable);
