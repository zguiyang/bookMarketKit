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
    summary: 'Create Tag',
    description: 'Create a new bookmark tag and return tag details',
    body: createTagBodySchema,
    response: { 201: tagResponseSchema },
  },
  update: {
    tags: ['BookmarkTag'],
    summary: 'Update Tag',
    description: 'Update tag information by ID and return updated tag details',
    body: updateTagBodySchema,
    response: { 200: tagResponseSchema },
  },
  delete: {
    tags: ['BookmarkTag'],
    summary: 'Delete Tag',
    description: 'Delete tag by ID, no content returned on success',
    params: tagIdParamSchema,
    response: { 204: z.void() },
  },
  all: {
    tags: ['BookmarkTag'],
    summary: 'Get All Tags',
    description: 'Get all bookmark tags for the current user',
    querystring: z.object({}),
    response: { 200: tagListResponseSchema },
  },
  detail: {
    tags: ['BookmarkTag'],
    summary: 'Get Tag Details',
    description: 'Get tag details by ID',
    params: tagIdParamSchema,
    response: { 200: tagResponseSchema },
  },
};
