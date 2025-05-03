import { z } from 'zod';
import { createUserBodySchema, userResponseSchema, allUsersResponseSchema, userIdParamSchema } from '@bookmark/schemas';

export const userSchemas = {
  create: {
    tags: ['User'],
    summary: '创建用户',
    description: '注册新用户，返回用户信息',
    body: createUserBodySchema,
    response: {
      201: userResponseSchema,
    },
  },
  all: {
    tags: ['User'],
    summary: '获取所有用户',
    description: '获取系统中所有用户的列表',
    querystring: z.any({}),
    response: {
      200: allUsersResponseSchema,
    },
  },
  findOne: {
    tags: ['User'],
    summary: '获取指定用户',
    description: '根据用户ID获取用户信息',
    params: userIdParamSchema,
    response: {
      200: userResponseSchema,
    },
  },
};