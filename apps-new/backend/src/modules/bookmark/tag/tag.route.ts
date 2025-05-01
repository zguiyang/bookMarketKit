import type { FastifyInstance } from 'fastify';
import { BookmarkTagController } from './tag.controller.js';
import { BookmarkTagService } from './tag.service.js';
import {
  CreateTagBody,
  UpdateTagBody,
  TagIdParam,
} from '@bookmark/schemas';
import { tagSchemas } from './tag.schema.js';

export default async function tagRoutes(fastify: FastifyInstance) {
  const tagService = new BookmarkTagService();
  const tagController = new BookmarkTagController(tagService);

  fastify.post<{ Body: CreateTagBody }>('/create', {
    schema: tagSchemas.create,
    handler: (req) => tagController.create(req),
  });

  fastify.put<{ Body: UpdateTagBody }>('/update', {
    schema: tagSchemas.update,
    handler: (req) => tagController.update(req),
  });

  fastify.delete<{ Params: TagIdParam }>('/delete/:id', {
    schema: tagSchemas.delete,
    handler: (req) => tagController.delete(req),
  });

  fastify.get('/all', {
    schema:tagSchemas.all,
    handler: () => tagController.all(),
  });

  fastify.get<{ Params: TagIdParam }>('/detail/:id', {
    schema: tagSchemas.detail,
    handler: (req) => tagController.detail(req),
  });
} 