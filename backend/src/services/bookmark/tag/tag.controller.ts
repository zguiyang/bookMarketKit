import { FastifyRequest } from 'fastify';
import { CreateTagBody, UpdateTagBody, TagIdParam } from '@bookmark/schemas';
import { TagService } from './tag.service';

export class TagController {
  constructor(private readonly tagService: TagService) {}

  async create(req: FastifyRequest<{ Body: CreateTagBody }>) {
    const userId = req.currentUser.id;
    return this.tagService.create(userId, req.body);
  }

  async update(req: FastifyRequest<{ Body: UpdateTagBody }>) {
    const userId = req.currentUser.id;
    return this.tagService.update(userId, req.body);
  }

  async delete(req: FastifyRequest<{ Params: TagIdParam }>) {
    const userId = req.currentUser.id;
    const { id } = req.params;
    return this.tagService.delete(userId, id);
  }

  async all(req: FastifyRequest) {
    const userId = req.currentUser.id;
    return this.tagService.findAll(userId);
  }

  async detail(req: FastifyRequest<{ Params: TagIdParam }>) {
    const userId = req.currentUser.id;
    const { id } = req.params;
    return this.tagService.findOne(userId, id);
  }
}
