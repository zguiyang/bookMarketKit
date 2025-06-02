import type { FastifyInstance } from 'fastify';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { CreateTagBody, UpdateTagBody, TagIdParam } from '@bookmark/schemas';
import { tagSchemas } from './tag.schema';

export default async function tagRoutes(fastify: FastifyInstance) {
  const tagService = new TagService();
  const tagController = new TagController(tagService);

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
    schema: tagSchemas.all,
    handler: (req) => tagController.all(req),
  });

  fastify.get<{ Params: TagIdParam }>('/detail/:id', {
    schema: tagSchemas.detail,
    handler: (req) => tagController.detail(req),
  });
}
