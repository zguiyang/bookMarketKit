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
  bookmarkSearchQuerySchema,
  bookmarkSearchResponseSchema,
  bookmarkPageListQuerySchema,
  bookmarkCollectionResponseSchema,
  bookmarkImportBodySchema,
  bookmarkImportResponseSchema,
} from '@bookmark/schemas';

export const bookmarkSchemas: {
  [key: string]: FastifySchema;
} = {
  create: {
    tags: ['Bookmark'],
    summary: 'Create Bookmark',
    description: 'Create a new bookmark and return its details',
    body: createBookmarkBodySchema,
    response: { 201: bookmarkResponseSchema },
  },
  update: {
    tags: ['Bookmark'],
    summary: 'Update Bookmark',
    description: 'Update bookmark information by ID and return updated details',
    body: updateBookmarkBodySchema,
    response: { 200: bookmarkResponseSchema },
  },
  delete: {
    tags: ['Bookmark'],
    summary: 'Delete Bookmark',
    description: 'Delete bookmark by ID, no content returned on success',
    params: bookmarkIdParamSchema,
    response: { 204: z.any() },
  },
  favorite: {
    tags: ['Bookmark'],
    summary: 'Set Bookmark Favorite',
    description: 'Set or unset bookmark favorite status and return updated details',
    body: setFavoriteBodySchema,
    response: { 200: z.any() },
  },
  pinned: {
    tags: ['Bookmark'],
    summary: 'Set Bookmark Pinned',
    description: 'Set or unset bookmark pinned status and return updated details',
    body: setPinnedBodySchema,
    response: { 200: z.any() },
  },
  all: {
    tags: ['Bookmark'],
    summary: 'Get All Bookmarks',
    description: 'Get all bookmarks list for current user',
    querystring: z.object({}),
    response: { 200: bookmarkListResponseSchema },
  },
  detail: {
    tags: ['Bookmark'],
    summary: 'Get Bookmark Details',
    description: 'Get bookmark details by ID',
    params: bookmarkIdParamSchema,
    response: { 200: bookmarkResponseSchema.nullable() },
  },
  pageList: {
    tags: ['Bookmark'],
    summary: 'Get Bookmarks by Page',
    description: 'Get paginated bookmark list with multi-condition filtering and sorting',
    querystring: bookmarkPageListQuerySchema,
    response: {
      200: bookmarkPageListResponseSchema,
    },
  },
  collection: {
    tags: ['Bookmark'],
    summary: 'Get Bookmark Collection Data',
    description: "Get user's bookmark collection related data",
    querystring: z.object({}),
    response: {
      200: bookmarkCollectionResponseSchema,
    },
  },
  visit: {
    tags: ['Bookmark'],
    summary: 'Update Bookmark Visit Time',
    description: "Update specified bookmark's last visit time and return updated details",
    body: updateLastVisitTimeBodySchema,
    response: { 200: bookmarkResponseSchema },
  },
  search: {
    tags: ['Bookmark'],
    summary: 'Search Bookmarks',
    description: 'Search by keyword and return matching bookmarks and tags',
    querystring: bookmarkSearchQuerySchema,
    response: { 200: bookmarkSearchResponseSchema },
  },
  import: {
    tags: ['Bookmark'],
    summary: 'Import Bookmarks',
    description: 'Import bookmarks',
    body: bookmarkImportBodySchema,
    response: { 200: bookmarkImportResponseSchema },
  },
  export: {
    tags: ['Bookmark'],
    summary: 'Export Bookmarks',
    description: 'Export bookmarks',
    response: { 200: z.any() },
  },
};
