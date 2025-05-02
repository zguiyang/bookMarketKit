import type { FastifyInstance } from 'fastify';
import { BookmarkCategoryController } from './bookmark.category.controller.js';
import { BookmarkCategoryService } from './bookmark.category.service.js';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
  CategoryIdParam,
} from '@bookmark/schemas';
import {
 categorySchemas
} from './bookmark.category.schema.js';

export default async function categoryRoutes(fastify: FastifyInstance) {
  const categoryService = new BookmarkCategoryService();
  const categoryController = new BookmarkCategoryController(categoryService);

  fastify.post<{ Body: CreateCategoryBody }>('/create', {
    schema: categorySchemas.create,
    handler: (req) => categoryController.create(req),
  });

  fastify.put<{ Body: UpdateCategoryBody }>('/update', {
    schema: categorySchemas.update,
    handler: (req) => categoryController.update(req),
  });

  fastify.delete<{ Params: CategoryIdParam }>('/delete/:id', {
    schema: categorySchemas.delete,
    handler: (req) => categoryController.delete(req),
  });

  fastify.get('/all', {
    schema: categorySchemas.all,
    handler: (req) => categoryController.all(req),
  });

  fastify.get<{ Params: CategoryIdParam }>('/detail/:id', {
    schema:categorySchemas.detail,
    handler: (req) => categoryController.detail(req),
  });
} 