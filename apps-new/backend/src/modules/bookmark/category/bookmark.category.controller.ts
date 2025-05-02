import { FastifyRequest } from 'fastify';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
  CategoryIdParam,
} from '@bookmark/schemas';
import { BookmarkCategoryService } from './bookmark.category.service.js';

export class BookmarkCategoryController {
  constructor(private readonly categoryService: BookmarkCategoryService) {}

  async create(req: FastifyRequest<{ Body: CreateCategoryBody }>) {
    const userId = req.currentUser.id;
    return this.categoryService.create(userId, req.body);
  }

  async update(req: FastifyRequest<{ Body: UpdateCategoryBody }>) {
    const userId = req.currentUser.id;
    return this.categoryService.update(userId, req.body);
  }

  async delete(req: FastifyRequest<{ Params: CategoryIdParam }>) {
    const userId = req.currentUser.id;
    const { id } = req.params;
    return this.categoryService.delete(userId, id);
  }

  async all(req: FastifyRequest) {
    const userId = req.currentUser.id;
    return this.categoryService.findAll(userId);
  }

  async detail(req: FastifyRequest<{ Params: CategoryIdParam }>) {
    const userId = req.currentUser.id;
    const { id } = req.params;
    return this.categoryService.findOne(userId, id);
  }
}
