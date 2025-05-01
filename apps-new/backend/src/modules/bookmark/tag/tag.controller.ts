import { FastifyRequest } from 'fastify';
import {
  CreateTagBody,
  UpdateTagBody,
  TagIdParam,
} from '@bookmark/schemas';
import { BookmarkTagService } from './tag.service.js';

export class BookmarkTagController {
  constructor(private readonly tagService: BookmarkTagService) {}

  async create(req: FastifyRequest<{ Body: CreateTagBody }>) {
    const userId = 'TODO_USER_ID';
    return this.tagService.create(userId, req.body);
  }

  async update(req: FastifyRequest<{ Body: UpdateTagBody }>) {
    const userId = 'TODO_USER_ID';
    return this.tagService.update(userId, req.body);
  }

  async delete(req: FastifyRequest<{ Params: TagIdParam }>) {
    const userId = 'TODO_USER_ID';
    const { id } = req.params;
    return this.tagService.delete(userId, id);
  }

  async all() {
    const userId = 'TODO_USER_ID';
    return this.tagService.findAll(userId);
  }

  async detail(req: FastifyRequest<{ Params: TagIdParam }>) {
    const userId = 'TODO_USER_ID';
    const { id } = req.params;
    return this.tagService.findOne(userId, id);
  }
} 