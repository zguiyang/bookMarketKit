import { FastifyRequest } from 'fastify';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
  CategoryIdParam,
} from '@bookmark/schemas';
import { BookmarkCategoryService } from './category.service.js';

export class BookmarkCategoryController {
  constructor(private readonly categoryService: BookmarkCategoryService) {}

  async create(req: FastifyRequest<{ Body: CreateCategoryBody }>) {
    const userId = 'TODO_USER_ID';
    return this.categoryService.create(userId, req.body);
  }

  async update(req: FastifyRequest<{ Body: UpdateCategoryBody }>) {
    const userId = 'TODO_USER_ID';
    return this.categoryService.update(userId, req.body);
  }

  async delete(req: FastifyRequest<{ Params: CategoryIdParam }>) {
    const userId = 'TODO_USER_ID';
    const { id } = req.params;
    return this.categoryService.delete(userId, id);
  }

  async all() {
    const userId = 'TODO_USER_ID';
    return this.categoryService.findAll(userId);
  }

  async detail(req: FastifyRequest<{ Params: CategoryIdParam }>) {
    const userId = 'TODO_USER_ID';
    const { id } = req.params;
    return this.categoryService.findOne(userId, id);
  }
}
