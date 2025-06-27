import type { FastifyInstance } from 'fastify';
import { TagService } from './tag.service.js';
import type { CreateTagBody, UpdateTagBody, TagIdParam } from '~shared/schemas/bookmark';
import { tagSchemas } from './tag.schema.js';

export default async function tagRoutes(fastify: FastifyInstance) {
  const tagService = new TagService();

  // Create tag
  fastify.post<{ Body: CreateTagBody }>('/create', {
    schema: tagSchemas.create,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return tagService.create(userId, req.body);
    },
  });

  // Update tag
  fastify.put<{ Body: UpdateTagBody }>('/update', {
    schema: tagSchemas.update,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return tagService.update(userId, req.body);
    },
  });

  // Delete tag
  fastify.delete<{ Params: TagIdParam }>('/delete/:id', {
    schema: tagSchemas.delete,
    handler: async (req) => {
      const userId = req.currentUser.id;
      const { id } = req.params;
      return tagService.delete(userId, id);
    },
  });

  // Get all tags
  fastify.get('/all', {
    schema: tagSchemas.all,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return tagService.findAll(userId);
    },
  });

  // Get tag details
  fastify.get<{ Params: TagIdParam }>('/detail/:id', {
    schema: tagSchemas.detail,
    handler: async (req) => {
      const userId = req.currentUser.id;
      const { id } = req.params;
      return tagService.findOne(userId, id);
    },
  });
}
