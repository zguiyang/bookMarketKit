import type { FastifyInstance } from 'fastify';
import { TagService } from './tag.service';
import { CreateTagBody, UpdateTagBody, TagIdParam } from '@bookmark/schemas';
import { tagSchemas } from './tag.schema';

export default async function tagRoutes(fastify: FastifyInstance) {
  const tagService = new TagService();

  // 创建标签
  fastify.post<{ Body: CreateTagBody }>('/create', {
    schema: tagSchemas.create,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return tagService.create(userId, req.body);
    },
  });

  // 更新标签
  fastify.put<{ Body: UpdateTagBody }>('/update', {
    schema: tagSchemas.update,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return tagService.update(userId, req.body);
    },
  });

  // 删除标签
  fastify.delete<{ Params: TagIdParam }>('/delete/:id', {
    schema: tagSchemas.delete,
    handler: async (req) => {
      const userId = req.currentUser.id;
      const { id } = req.params;
      return tagService.delete(userId, id);
    },
  });

  // 获取所有标签
  fastify.get('/all', {
    schema: tagSchemas.all,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return tagService.findAll(userId);
    },
  });

  // 获取标签详情
  fastify.get<{ Params: TagIdParam }>('/detail/:id', {
    schema: tagSchemas.detail,
    handler: async (req) => {
      const userId = req.currentUser.id;
      const { id } = req.params;
      return tagService.findOne(userId, id);
    },
  });
}
