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
    summary: 'Create Category',
    description: 'Create a new bookmark category and return category details',
    body: createCategoryBodySchema,
    response: { 201: categoryResponseSchema },
  },
  update: {
    tags: ['BookmarkCategory'],
    summary: 'Update Category',
    description: 'Update category information by ID and return updated category details',
    body: updateCategoryBodySchema,
    response: { 200: categoryResponseSchema },
  },
  delete: {
    tags: ['BookmarkCategory'],
    summary: 'Delete Category',
    description: 'Delete category by ID, no content returned on success',
    params: categoryIdParamSchema,
    response: { 204: z.void() },
  },
  all: {
    tags: ['BookmarkCategory'],
    summary: 'Get All Categories',
    description: 'Get all bookmark categories for the current user',
    querystring: z.any({}),
    response: { 200: categoryListResponseSchema },
  },
  detail: {
    tags: ['BookmarkCategory'],
    summary: 'Get Category Details',
    description: 'Get category details by ID',
    params: categoryIdParamSchema,
    response: { 200: categoryResponseSchema.nullable() },
  },
};
