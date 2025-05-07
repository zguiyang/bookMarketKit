import { FastifySchema } from 'fastify';
import { z } from 'zod';
import {
  createBookmarkBodySchema,
  updateBookmarkBodySchema,
  bookmarkResponseSchema,
  bookmarkListResponseSchema,
  bookmarkPageListResponseSchema,
  bookmarkIdParamSchema,
  setFavoriteBodySchema,
  setPinnedBodySchema,
  updateLastVisitTimeBodySchema,
  searchQuerySchema,
  bookmarkPageListQuerySchema,
  bookmarkCollectionResponseSchema,
} from '@bookmark/schemas';

export const bookmarkSchemas: {
  [key: string]: FastifySchema;
} = {
  create: {
    tags: ['Bookmark'],
    summary: '创建书签',
    description: '创建一个新的书签，返回书签详情',
    body: createBookmarkBodySchema,
    response: { 201: bookmarkResponseSchema },
  },
  update: {
    tags: ['Bookmark'],
    summary: '更新书签',
    description: '根据ID更新书签信息，返回更新后的书签详情',
    body: updateBookmarkBodySchema,
    response: { 200: bookmarkResponseSchema },
  },
  delete: {
    tags: ['Bookmark'],
    summary: '删除书签',
    description: '根据ID删除书签，成功无返回内容',
    params: bookmarkIdParamSchema,
    response: { 204: z.any() },
  },
  favorite: {
    tags: ['Bookmark'],
    summary: '设置书签收藏',
    description: '设置或取消书签的收藏状态，返回更新后的书签详情',
    body: setFavoriteBodySchema,
    response: { 200: z.any() },
  },
  pinned: {
    tags: ['Bookmark'],
    summary: '设置书签置顶',
    description: '设置或取消书签的置顶状态，返回更新后的书签详情',
    body: setPinnedBodySchema,
    response: { 200: z.any() },
  },
  all: {
    tags: ['Bookmark'],
    summary: '获取所有书签',
    description: '获取当前用户的所有书签列表',
    querystring: z.object({}),
    response: { 200: bookmarkListResponseSchema },
  },
  detail: {
    tags: ['Bookmark'],
    summary: '获取书签详情',
    description: '根据ID获取书签详情',
    params: bookmarkIdParamSchema,
    response: { 200: bookmarkResponseSchema },
  },
  pageList: {
    tags: ['Bookmark'],
    summary: '分页获取书签',
    description: '分页获取书签列表，支持多条件筛选和排序',
    querystring: bookmarkPageListQuerySchema,
    response: {
      200: bookmarkPageListResponseSchema,
    },
  },
  collection: {
    tags: ['Bookmark'],
    summary: '获取书签集合数据',
    description: '获取用户的书签相关集合数据',
    querystring: z.object({}),
    response: {
      200: bookmarkCollectionResponseSchema,
    },
  },
  visit: {
    tags: ['Bookmark'],
    summary: '更新书签访问时间',
    description: '更新指定书签的最后访问时间，返回更新后的书签详情',
    body: updateLastVisitTimeBodySchema,
    response: { 200: bookmarkResponseSchema },
  },
  search: {
    tags: ['Bookmark'],
    summary: '搜索书签',
    description: '根据关键词搜索书签，返回匹配的书签列表',
    querystring: searchQuerySchema,
    response: { 200: bookmarkListResponseSchema },
  },
};
