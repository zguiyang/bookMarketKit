import { FastifySchema } from 'fastify';
import { z } from 'zod';
import {
  createCategoryBodySchema,
  updateCategoryBodySchema,
  categoryResponseSchema,
  categoryListResponseSchema,
  categoryIdParamSchema,
} from '@bookmark/schemas';

export const categorySchemas: {
  [key: string]: FastifySchema;
} = {
  create: {
    tags: ['BookmarkCategory'],
    summary: '创建分类',
    description: '创建一个新的书签分类，返回分类详情',
    body: createCategoryBodySchema,
    response: { 201: categoryResponseSchema },
  },
  update: {
    tags: ['BookmarkCategory'],
    summary: '更新分类',
    description: '根据ID更新分类信息，返回更新后的分类详情',
    body: updateCategoryBodySchema,
    response: { 200: categoryResponseSchema },
  },
  delete: {
    tags: ['BookmarkCategory'],
    summary: '删除分类',
    description: '根据ID删除分类，成功无返回内容',
    params: categoryIdParamSchema,
    response: { 204: z.void() },
  },
  all: {
    tags: ['BookmarkCategory'],
    summary: '获取所有分类',
    description: '获取当前用户的所有书签分类列表',
    querystring: z.void(),
    response: { 200: categoryListResponseSchema },
  },
  detail: {
    tags: ['BookmarkCategory'],
    summary: '获取分类详情',
    description: '根据ID获取分类详情',
    params: categoryIdParamSchema,
    response: { 200: categoryResponseSchema },
  },
};
