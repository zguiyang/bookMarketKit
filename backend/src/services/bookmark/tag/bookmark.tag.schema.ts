import { FastifySchema } from 'fastify';
import { z } from 'zod';
import {
  createTagBodySchema,
  updateTagBodySchema,
  tagResponseSchema,
  tagListResponseSchema,
  tagIdParamSchema,
} from '@bookmark/schemas';

export const tagSchemas: {
  [key: string]: FastifySchema;
} = {
  create: {
    tags: ['BookmarkTag'],
    summary: '创建标签',
    description: '创建一个新的书签标签，返回标签详情',
    body: createTagBodySchema,
    response: { 201: tagResponseSchema },
  },
  update: {
    tags: ['BookmarkTag'],
    summary: '更新标签',
    description: '根据ID更新标签信息，返回更新后的标签详情',
    body: updateTagBodySchema,
    response: { 200: tagResponseSchema },
  },
  delete: {
    tags: ['BookmarkTag'],
    summary: '删除标签',
    description: '根据ID删除标签，成功无返回内容',
    params: tagIdParamSchema,
    response: { 204: z.void() },
  },
  all: {
    tags: ['BookmarkTag'],
    summary: '获取所有标签',
    description: '获取当前用户的所有书签标签列表',
    querystring: z.object({}),
    response: { 200: tagListResponseSchema },
  },
  detail: {
    tags: ['BookmarkTag'],
    summary: '获取标签详情',
    description: '根据ID获取标签详情',
    params: tagIdParamSchema,
    response: { 200: tagResponseSchema },
  },
};
