import { z } from 'zod';
import {
  createPaginatedRequestSchema,
  createPaginatedResponseSchema,
  PaginationDirectionEnum,
} from '../common/response.schema';
import { categoryResponseSchema } from './bookmark.category.schema';
import { tagResponseSchema } from './bookmark.tag.schema';

// 书签排序字段枚举
export const BookmarkOrderByEnum = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  LAST_VISITED_AT: 'lastVisitedAt',
  VISIT_COUNT: 'visitCount',
  TITLE: 'title',
} as const;

// enums for bookmark YES
export const BookmarkFavoriteEnum = {
  YES: 'FAVORITE',
  NO: 'UN_FAVORITE',
} as const;

// enums for bookmark YES
export const BookmarkPinnedEnum = {
  YES: 'PINNED',
  NO: 'UN_PINNED',
} as const;

// 书签基础Schema
export const bookmarkResponseSchema = z.object({
  _id: z.string(),
  user: z.string(),
  url: z.string(),
  icon: z.string(),
  title: z.string(),
  visitCount: z.number(),
  isFavorite: z.enum([BookmarkFavoriteEnum.YES, BookmarkFavoriteEnum.NO]),
  isPinned: z.enum([BookmarkPinnedEnum.YES, BookmarkPinnedEnum.NO]),
  description: z.string().optional(),
  screenshotUrl: z.string().optional(),
  lastVisitedAt: z.string().optional(),
  categories: z.array(categoryResponseSchema),
  tags: z.array(tagResponseSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 书签列表Schema
export const bookmarkListResponseSchema = z.array(bookmarkResponseSchema);
export const bookmarkPageListResponseSchema = createPaginatedResponseSchema(bookmarkResponseSchema);

// 书签集合Schema
export const bookmarkCollectionResponseSchema = z.object({
  pinnedBookmarks: bookmarkListResponseSchema,
  recentBookmarks: bookmarkListResponseSchema,
  recentAddedBookmarks: bookmarkListResponseSchema,
});

// 书签创建和更新Schema
export const createBookmarkBodySchema = z
  .object({
    title: z.string().min(1, { message: '书签标题不能为空' }),
    url: z.string().url({ message: '请输入有效的URL' }),
    description: z.string().optional(),
    icon: z.string().optional(),
    categoryIds: z.array(z.string()).optional(),
    tagIds: z.array(z.string()).optional(),
  })
  .strict();

export const updateBookmarkBodySchema = z
  .object({
    id: z.string().min(1, { message: '书签ID不能为空' }),
    title: z.string().optional(),
    url: z.string().url({ message: '请输入有效的URL' }).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    categoryIds: z.array(z.string()).optional(),
    tagIds: z.array(z.string()).optional(),
  })
  .strict();

// 书签ID参数Schema
export const bookmarkIdParamSchema = z.object({
  id: z.string().min(1, { message: '书签ID不能为空' }),
});

// 功能相关Schema
export const setFavoriteBodySchema = z.object({
  id: z.string().min(1, { message: '书签ID不能为空' }),
  favorite: z.enum([BookmarkFavoriteEnum.YES, BookmarkFavoriteEnum.NO]),
});

export const setPinnedBodySchema = z.object({
  id: z.string().min(1, { message: '书签ID不能为空' }),
  pinned: z.enum([BookmarkPinnedEnum.YES, BookmarkPinnedEnum.NO]),
});

export const updateLastVisitTimeBodySchema = z.object({
  id: z.string().min(1, { message: '书签ID不能为空' }),
});

// 搜索和分页Schema
export const searchQuerySchema = z.object({
  keyword: z.string().min(1, { message: '搜索关键词不能为空' }),
});

const bookmarkPageListBaseSchema = z.object({
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  keyword: z.string().optional(),
  isFavorite: z.enum([BookmarkFavoriteEnum.YES, BookmarkFavoriteEnum.NO]).optional(),
  isPinned: z.enum([BookmarkPinnedEnum.YES, BookmarkPinnedEnum.NO]).optional(),
  orderBy: z.nativeEnum(BookmarkOrderByEnum).optional(),
  direction: z.nativeEnum(PaginationDirectionEnum).optional(),
});

export const bookmarkPageListQuerySchema = createPaginatedRequestSchema(bookmarkPageListBaseSchema);

// 类型导出
export type BookmarkResponse = z.infer<typeof bookmarkResponseSchema>;
export type BookmarkListResponse = z.infer<typeof bookmarkListResponseSchema>;
export type BookmarkPageListResponse = z.infer<typeof bookmarkPageListResponseSchema>;
export type BookmarkCollectionResponse = z.infer<typeof bookmarkCollectionResponseSchema>;
export type CreateBookmarkBody = z.infer<typeof createBookmarkBodySchema>;
export type UpdateBookmarkBody = z.infer<typeof updateBookmarkBodySchema>;
export type BookmarkIdParam = z.infer<typeof bookmarkIdParamSchema>;
export type SetFavoriteBody = z.infer<typeof setFavoriteBodySchema>;
export type SetPinnedBody = z.infer<typeof setPinnedBodySchema>;
export type UpdateLastVisitTimeBody = z.infer<typeof updateLastVisitTimeBodySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type BookmarkPageListQuery = z.infer<typeof bookmarkPageListQuerySchema>;
export type BookmarkOrderBy = keyof typeof BookmarkOrderByEnum;
