import type { FastifyInstance } from 'fastify';
import { CategoryService } from './category.service.js';
import { CreateCategoryBody, UpdateCategoryBody, CategoryIdParam } from '@bookmark/schemas';
import { categorySchemas } from './category.schema.js';

export default async function categoryRoutes(fastify: FastifyInstance) {
  const categoryService = new CategoryService();

  // 创建分类
  fastify.post<{ Body: CreateCategoryBody }>('/create', {
    schema: categorySchemas.create,
    handler: async (req) => {
      // Extract userId and call service
      const userId = req.currentUser.id;
      return categoryService.create(userId, req.body);
    },
  });

  // 更新分类
  fastify.put<{ Body: UpdateCategoryBody }>('/update', {
    schema: categorySchemas.update,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return categoryService.update(userId, req.body);
    },
  });

  // 删除分类
  fastify.delete<{ Params: CategoryIdParam }>('/delete/:id', {
    schema: categorySchemas.delete,
    handler: async (req) => {
      const userId = req.currentUser.id;
      const { id } = req.params;
      return categoryService.delete(userId, id);
    },
  });

  // 获取所有分类
  fastify.get('/all', {
    schema: categorySchemas.all,
    handler: async (req) => {
      const userId = req.currentUser.id;
      return categoryService.findAll(userId);
    },
  });

  // 获取分类详情
  fastify.get<{ Params: CategoryIdParam }>('/detail/:id', {
    schema: categorySchemas.detail,
    handler: async (req) => {
      const userId = req.currentUser.id;
      const { id } = req.params;
      return categoryService.findOne(userId, id);
    },
  });
}
