import type { FastifyInstance } from 'fastify';
import { BookmarkTagService } from './tag/bookmark.tag.service';
import { BookmarkCategoryService } from './category/bookmark.category.service';
import { BookmarkController } from './bookmark.controller.js';
import { BookmarkService } from './bookmark.service.js';
import {
  CreateBookmarkBody,
  UpdateBookmarkBody,
  BookmarkIdParam,
  SetFavoriteBody,
  SetPinnedBody,
  UpdateLastVisitTimeBody,
  BookmarkSearchQuery,
  BookmarkPageListQuery,
} from '@bookmark/schemas';
import { bookmarkSchemas } from './bookmark.schema.js';

export default async function bookmarkRoutes(fastify: FastifyInstance) {
  const bookmarkCategoryService = new BookmarkCategoryService();
  const bookmarkTagService = new BookmarkTagService();
  const bookmarkService = new BookmarkService(bookmarkCategoryService, bookmarkTagService);
  const bookmarkController = new BookmarkController(bookmarkService);

  fastify.post<{ Body: CreateBookmarkBody }>('/create', {
    schema: bookmarkSchemas.create,
    handler: (req) => bookmarkController.create(req),
  });

  fastify.put<{ Body: UpdateBookmarkBody }>('/update', {
    schema: bookmarkSchemas.update,
    handler: (req) => bookmarkController.update(req),
  });

  fastify.delete<{ Params: BookmarkIdParam }>('/delete/:id', {
    schema: bookmarkSchemas.delete,
    handler: (req) => bookmarkController.delete(req),
  });

  fastify.patch<{ Body: SetFavoriteBody }>('/favorite', {
    schema: bookmarkSchemas.favorite,
    handler: (req) => bookmarkController.favorite(req),
  });

  fastify.patch<{ Body: SetPinnedBody }>('/pinned', {
    schema: bookmarkSchemas.pinned,
    handler: (req) => bookmarkController.pinned(req),
  });

  fastify.get('/all', {
    schema: bookmarkSchemas.all,
    handler: (req) => bookmarkController.all(req),
  });

  fastify.get<{ Params: BookmarkIdParam }>('/detail/:id', {
    schema: bookmarkSchemas.detail,
    handler: (req) => bookmarkController.detail(req),
  });

  fastify.get<{ Querystring: BookmarkPageListQuery }>('/pageList', {
    schema: bookmarkSchemas.pageList,
    handler: (req) => bookmarkController.pageList(req),
  });

  fastify.get('/collection', {
    schema: bookmarkSchemas.collection,
    handler: (req) => bookmarkController.collection(req),
  });

  fastify.patch<{ Body: UpdateLastVisitTimeBody }>('/visit', {
    schema: bookmarkSchemas.visit,
    handler: (req) => bookmarkController.visit(req),
  });

  fastify.get<{ Querystring: BookmarkSearchQuery }>('/search', {
    schema: bookmarkSchemas.search,
    handler: (req) => bookmarkController.search(req),
  });
}
